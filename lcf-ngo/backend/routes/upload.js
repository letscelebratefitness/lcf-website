const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const uploadAsset = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

const getUploadedFile = (req) => req.files?.file?.[0] || req.files?.image?.[0] || null;
const getAssetType = (file) => file.mimetype === 'application/pdf' ? 'pdf' : 'image';

// POST /api/upload - Admin: upload single file
router.post('/', protect, (req, res) => {
  uploadAsset(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const file = getUploadedFile(req);
      if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const type = getAssetType(file);

      res.json({
        success: true,
        url: file.path || file.secure_url,
        publicId: file.filename,
        type,
        message: `${type} uploaded successfully`
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  );
});

// DELETE /api/upload/:publicId - Admin: delete uploaded asset
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const resourceType = req.query.type === 'pdf' ? 'raw' : 'image';
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ success: true, message: 'Asset deleted from cloud' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
