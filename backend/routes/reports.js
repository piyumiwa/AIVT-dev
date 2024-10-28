const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const reportController = require('../controllers/reportController'); 
const authMiddleware = require('../middleware/authMiddleware');
const checkOwner = require('../middleware/checkOwner');
const adminMiddleware = require('../middleware/adminMiddleware');

// Define the routes
router.get('/vulnerability-db', reportController.getAllReports);
// router.post('/report-data', authMiddleware, upload.array('attachments'), reportController.createReport);
router.post('/report-data', upload.array('attachments'), reportController.createReport);
router.get('/vulnerability-db/search', reportController.searchReports);
router.get('/vulnerability-db/pending', authMiddleware, adminMiddleware, reportController.getPendingReports);

router.get('/vulnerability-db/:id', reportController.getReportById);
router.put('/vulnerability-db/:id/edit', authMiddleware, checkOwner, upload.array('attachments'), reportController.updateReport);
router.delete('/vulnerability-db/:id/delete', authMiddleware, checkOwner, reportController.deleteReport);
router.post('/vulnerability-db/:id/review', authMiddleware, adminMiddleware, reportController.reviewReport);

router.get('/vulnerability-db/attachments/:id/:filename', reportController.getAttachment);

module.exports = router;
