const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const projectController = require('../controllers/projectController');

router.post('/createproject', authenticate, projectController.createProject);
router.get('/projectsList', authenticate, projectController.listProjects);
router.put('/addmember', authenticate, projectController.addProjectMember);
router.put('/removemember', authenticate, projectController.removeProjectMember);
router.get('/project-members/:projectid', authenticate, projectController.getProjectMembers);
router.put('/editproject', authenticate, projectController.editProject);
router.delete('/deleteproject/:projectid', authenticate, projectController.deleteProject);

module.exports = router;