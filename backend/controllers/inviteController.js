const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");
const inviteModel = require("../models/inviteModels");
const resolveExpiredInvites = require("../utils/resolveExpiredInvites");

const INVITE_EXPIRY_HOURS = 24;

// Admin kisi user ko project me invite karta hai — direct add nahi hota,
// pehle ek "Pending" request banti hai
const sendInvite = async (req, res) => {
  try {
    await resolveExpiredInvites();

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

    // Sirf project admin hi invite bhej sakta hai
    if (project.projectadmin !== req.user.userId) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "Only Project Admin can invite members" },
        Data: {}
      });
    }

    const user = await userModel.findById(memberid);
    if (!user) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "User not found" },
        Data: {}
      });
    }

    const alreadyMember = await projectModel.isMember(projectid, memberid);
    if (alreadyMember) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "User is already a member of this project" },
        Data: {}
      });
    }

    const pending = await inviteModel.findPendingInvite(projectid, memberid);
    if (pending) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "An invite is already pending for this user" },
        Data: {}
      });
    }

    const created_at = new Date().toISOString();
    const expires_at = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const invite = await inviteModel.createInvite({
      project_id: projectid,
      invited_user_id: memberid,
      invited_by: req.user.userId,
      created_at,
      expires_at,
    });

    return res.status(201).json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { invite, message: `Invite sent to ${user.name}` }
    });
  } catch (err) {
    console.error("Send Invite Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// Logged-in user apne saare pending invites dekhega
const getMyInvites = async (req, res) => {
  try {
    await resolveExpiredInvites();
    const invites = await inviteModel.getMyPendingInvites(req.user.userId);
    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { invites }
    });
  } catch (err) {
    console.error("Get My Invites Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// User apni invite accept ya reject karega
const respondInvite = async (req, res) => {
  try {
    await resolveExpiredInvites();

    const { inviteid, action } = req.body; // action: "Accept" | "Reject"
    if (!inviteid || !["Accept", "Reject"].includes(action)) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "inviteid and valid action (Accept/Reject) are required" },
        Data: {}
      });
    }

    const invite = await inviteModel.findInviteById(inviteid);
    if (!invite) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Invite not found" },
        Data: {}
      });
    }

    if (Number(invite.invited_user_id) !== Number(req.user.userId)) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "This invite is not addressed to you" },
        Data: {}
      });
    }

    if (invite.status !== "Pending") {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: `This invite has already been ${invite.status}` },
        Data: {}
      });
    }

    const responded_at = new Date().toISOString();

    if (action === "Accept") {
      await projectModel.addMember(invite.project_id, invite.invited_user_id);
      await inviteModel.respondToInvite(inviteid, "Accepted", responded_at);
    } else {
      await inviteModel.respondToInvite(inviteid, "Rejected", responded_at);
    }

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { message: `Invite ${action === "Accept" ? "accepted" : "rejected"} successfully` }
    });
  } catch (err) {
    console.error("Respond Invite Error:", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

module.exports = {
  sendInvite,
  getMyInvites,
  respondInvite,
};