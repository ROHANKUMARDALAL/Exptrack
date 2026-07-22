// const express = require('express');
// const router = express.Router();
// const authenticate = require('../middlewares/authenticate');
// const projectController = require('../controllers/projectController');

// router.post('/createproject', authenticate, projectController.createProject);
// router.get('/projectsList', authenticate, projectController.listProjects);
// // router.put('/addmember', authenticate, projectController.addProjectMember);
// router.put('/removemember',authenticate,projectController.removeProjectMember,);
// router.get('/project-members/:projectid',authenticate,projectController.getProjectMembers,);
// router.put('/editproject', authenticate, projectController.editProject);
// router.delete('/deleteproject/:projectid',authenticate,projectController.deleteProject,);
// // router.get('/my-invitations', authenticate, projectController.getMyInvitations);
// // router.put('/accept-invite',authenticate,projectController.acceptProjectInvite,);
// // router.put('/reject-invite',authenticate,projectController.rejectProjectInvite,);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const projectController = require('../controllers/projectController');
const inviteController = require('../controllers/inviteController');

router.post('/createproject', authenticate, projectController.createProject);
router.get('/projectsList', authenticate, projectController.listProjects);
router.put('/removemember', authenticate, projectController.removeProjectMember);
router.get('/project-members/:projectid', authenticate, projectController.getProjectMembers);
router.put('/editproject', authenticate, projectController.editProject);
router.delete('/deleteproject/:projectid', authenticate, projectController.deleteProject);

// CHANGED: /addmember ab directly add nahi karta — ye ab ek invite/request bhejta hai
router.put('/addmember', authenticate, inviteController.sendInvite);

// NEW: invite/request system
router.get('/myinvites', authenticate, inviteController.getMyInvites);
router.put('/respondinvite', authenticate, inviteController.respondInvite);

module.exports = router;