import tagRepository from '../repositories/tagRepository.js';

export const getUserTags = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const tags = await tagRepository.getAllTagsByUserId(userId);

    res.status(200).json({
      success: true,
      data: tags,
      message: 'Tags retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getUserTags controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tags',
      error: error.message,
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { tagName } = req.body;

    if (!tagName || !tagName.trim()) {
      return res.status(400).json({ success: false, message: 'Tag name is required' });
    }

    const updatedTag = await tagRepository.updateTag(id, userId, tagName.toLowerCase().trim());
    
    if (!updatedTag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    res.status(200).json({ success: true, data: updatedTag, message: 'Tag updated successfully' });
  } catch (error) {
    console.error('Error in updateTag controller:', error);
    res.status(500).json({ success: false, message: 'Failed to update tag', error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await tagRepository.deleteTag(id, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    res.status(200).json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTag controller:', error);
    res.status(500).json({ success: false, message: 'Failed to delete tag', error: error.message });
  }
};
