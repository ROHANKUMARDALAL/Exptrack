const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');

const createProject = async (req, res) => {
  try {
    const { projectname, projectdescription, members } = req.body;
    if (!projectname) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'projectname is required' }, Data: {} });
    }
    if (!Array.isArray(members) || members.length == 0) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'members array is required and cannot be empty' }, Data: {} });
    }

    const ids = [];
    const names = [];

    members.forEach(item => {
      if (item && typeof item === 'object') {
        if (item.id) {
          ids.push(Number(item.id));
        } else if (item.name) {
          names.push(String(item.name));
        }
      }
    });

    if (!ids.length && !names.length) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'members must contain id or name for each member' }, Data: {} });
    }

    const existingMembers = [];
    if (ids.length) {
      const usersById = await userModel.findByIds(ids);
      if (usersById.length !== ids.length) {
        return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'One or more member ids are invalid' }, Data: {} });
      }
      usersById.forEach(user => {
        existingMembers.push({ id: user.id, name: user.name });
      });
    }

    for (const name of names) {
      const usersByName = await userModel.findByName(name);
      if (usersByName.length === 0) {
        return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: `Member name not found: ${name}` }, Data: {} });
      }
      if (usersByName.length > 1) {
        return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: `Member name is ambiguous: ${name}` }, Data: {} });
      }
      const user = usersByName[0];
      if (!existingMembers.some(m => m.id === user.id)) {
        existingMembers.push({ id: user.id, name: user.name });
      }
    }

    // Login User
    const projectadmin = req.user.userId;

    // Admin ko members me add karo agar already nahi hai
    if (!existingMembers.some(m => m.id === projectadmin)) {
      const admin = await userModel.findById(projectadmin);
      if (admin) {
        existingMembers.push({ id: admin.id, name: admin.name });
      }
    }

    // FIX: ISO format use karo, ye sortable hai (DB me ORDER BY created_at ke liye zaroori)
    // Display ke time frontend me IST me convert kar lena.
    const created_at = new Date().toISOString();

    // FIX: sirf Date.now() se collision ka chhota risk tha (same millisecond me 2 requests),
    // ab ek random suffix bhi add kar diya
    const normalizedProjectId = `PRJ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const project = await projectModel.createProject({
      projectid: normalizedProjectId,
      projectname,
      projectdescription: projectdescription || null,
      projectadmin,
      created_at,
      members: existingMembers,
    });

    return res.status(201).json({
      Error: { ErrorCode: 0, ErrorMessage: 'success' },
      Data: { project },
    });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const listProjects = async (req, res) => {
  try {
    const member_id = req.user.userId;
    const projects = await projectModel.getProjectsByMember(member_id);
    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { projects } });
  } catch (err) {
    console.error('List projects error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { projectid, memberid } = req.body;

    if (!projectid || !memberid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid and memberid are required" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    // Only Project Admin
    if (project.projectadmin !== req.user.userId) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "Only Project Admin can add members" },
        Data: {}
      });
    }

    const user = await userModel.findById(memberid);
    if (!user) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Member not found" },
        Data: {}
      });
    }

    // FIX: JS array check ki jagah ab direct DB check + INSERT OR IGNORE
    const alreadyMember = await projectModel.isMember(projectid, memberid);
    if (alreadyMember) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "Member already exists" },
        Data: {}
      });
    }

    await projectModel.addMember(projectid, memberid);
    const members = await projectModel.findByProjectId(projectid).then(p => p.members);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { message: "Member added successfully", members }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    const { projectid, memberid } = req.body;
    if (!projectid || !memberid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid and memberid are required" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    // Only Admin
    if (project.projectadmin !== req.user.userId) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "Only Project Admin can remove members" },
        Data: {}
      });
    }

    // Admin khud remove nahi ho sakta
    if (Number(memberid) === Number(project.projectadmin)) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "Project Admin cannot be removed" },
        Data: {}
      });
    }

    await projectModel.removeMember(projectid, memberid);
    const members = await projectModel.findByProjectId(projectid).then(p => p.members);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { message: "Member removed successfully", members }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const { projectid } = req.params;
    if (!projectid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid is required" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    // FIX: DB-level check (project_members table) instead of JS array scan
    const isMember = await projectModel.isMember(projectid, req.user.userId);
    if (!isMember) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not a member of this project" },
        Data: {}
      });
    }

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: {
        projectid: project.projectid,
        projectname: project.projectname,
        projectadmin: project.projectadmin,
        membercount: project.membercount,
        members: project.members
      }
    });
  } catch (err) {
    console.error("Get Project Members Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// NEW: Edit project — sirf admin project ka naam/description edit kar sakta hai
const editProject = async (req, res) => {
  try {
    const { projectid, projectname, projectdescription } = req.body;
    if (!projectid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid is required" },
        Data: {}
      });
    }
    if (!projectname && !projectdescription) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "Nothing to update — provide projectname or projectdescription" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    if (project.projectadmin !== req.user.userId) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "Only Project Admin can edit this project" },
        Data: {}
      });
    }

    await projectModel.editProject(projectid, { projectname, projectdescription });
    const updatedProject = await projectModel.findByProjectId(projectid);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { project: updatedProject }
    });
  } catch (err) {
    console.error("Edit Project Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// NEW: Delete project — sirf admin delete kar sakta hai (members + expenses bhi cascade delete)
const deleteProject = async (req, res) => {
  try {
    const { projectid } = req.params;
    if (!projectid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid is required" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    if (project.projectadmin !== req.user.userId) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "Only Project Admin can delete this project" },
        Data: {}
      });
    }

    await projectModel.deleteProject(projectid);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { message: "Project deleted successfully" }
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};
const getMyInvitations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invitations = await projectModel.getPendingInvitations(userId);
    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { invitations } });
  } catch (err) {
    console.error("Get Invitations Error:", err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: "Internal server error" }, Data: {} });
  }
};

// NEW: Invite accept karna
const acceptProjectInvite = async (req, res) => {
  try {
    const { projectid } = req.body;
    const userId = req.user.userId;
    
    if (!projectid) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: "projectid is required" }, Data: {} });
    }

    const changes = await projectModel.acceptInvitation(projectid, userId);
    if (changes === 0) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: "No pending invite found for this project" }, Data: {} });
    }

    return res.json({ Error: { ErrorCode: 0, ErrorMessage: "success" }, Data: { message: "Invitation accepted. You are now a member." } });
  } catch (err) {
    console.error("Accept Invite Error:", err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: "Internal server error" }, Data: {} });
  }
};

// NEW: Invite reject karna
const rejectProjectInvite = async (req, res) => {
  try {
    const { projectid } = req.body;
    const userId = req.user.userId;

    if (!projectid) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: "projectid is required" }, Data: {} });
    }

    await projectModel.rejectInvitation(projectid, userId);
    
    return res.json({ Error: { ErrorCode: 0, ErrorMessage: "success" }, Data: { message: "Invitation rejected." } });
  } catch (err) {
    console.error("Reject Invite Error:", err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: "Internal server error" }, Data: {} });
  }
};



module.exports = {
  createProject,
  listProjects,
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
  editProject,
  deleteProject,
  getMyInvitations, 
  acceptProjectInvite, 
  rejectProjectInvite
};