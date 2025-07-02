const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const reportController = require('../controllers/reportController'); 
// const authMiddleware = require('../middleware/authMiddleware');
// const checkOwner = require('../middleware/checkOwner');
// const adminMiddleware = require('../middleware/adminMiddleware');

// Define the routes
router.get('/vulnerability-db', reportController.getAllReports);
// router.post('/report-data', authMiddleware, upload.array('attachments'), reportController.createReport);
router.post('/report-data', upload.array('attachments'), reportController.createReport);
router.get('/vulnerability-db/search', reportController.searchReports);
router.get('/vulnerability-db/pending', reportController.getPendingReports);
router.get('/vulnerability-db/rejected', reportController.rejectedReports);

router.get('/vulnerability-db/id/:id', reportController.getReportById);
router.get('/vulnerability-db/token/:token', reportController.getReportByToken);
// router.put('/vulnerability-db/:id/edit', authMiddleware, checkOwner, upload.array('attachments'), reportController.updateReport);
router.put('/vulnerability-db/editid/:id', upload.array('attachments'), reportController.updateReport);
router.put('/vulnerability-db/edittoken/:token', upload.array('attachments'), reportController.updateReportByToken);
router.delete('/vulnerability-db/:id/delete', reportController.deleteReport);
router.put('/vulnerability-db/:id/review', reportController.reviewReport);
router.get('/vulnerability-db/:id/comments', reportController.reportComments);

router.get('/vulnerability-db/attachments/:id/:filename', reportController.getAttachment);

module.exports = router; 
