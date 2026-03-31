import * as cardService from '../services/cardService.js';
import { pool } from '../config/db.js'; // Added for debug querying

export const createCard = async (req, res) => {
  try {
    const cardData = {
      ...req.body,
      user_id: req.user.id,
    };

    const newCard = await cardService.createCard(cardData);

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      data: newCard,
    });
  } catch (error) {
    console.error('Create card error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating card',
    });
  }
};

export const getCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await cardService.getCards({ ...req.query, user_id: req.user.id }, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cards',
    });
  }
};

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await cardService.getCardById(id, req.user.id);

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Card not found',
    });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCard = await cardService.updateCard(id, req.user.id, updateData);

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      data: updatedCard,
    });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating card',
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    await cardService.deleteCard(id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Card deleted successfully',
    });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Error deleting card',
    });
  }
};

export const getTrashCards = async (req, res) => {
  try {
    const cards = await cardService.getTrashCards(req.user.id);
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error('Get trash cards error:', error);
    res
      .status(500)
      .json({ success: false, message: error.message || 'Error fetching trash cards' });
  }
};

export const restoreCard = async (req, res) => {
  try {
    const { id } = req.params;
    await cardService.restoreCard(id, req.user.id);
    res.status(200).json({ success: true, message: 'Card restored successfully' });
  } catch (error) {
    console.error('Restore card error:', error);
    res.status(404).json({ success: false, message: error.message || 'Error restoring card' });
  }
};

export const hardDeleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await cardService.hardDeleteCard(id, req.user.id);
    res.status(200).json({ success: true, message: 'Card permanently deleted' });
  } catch (error) {
    console.error('Hard delete card error:', error);
    res.status(404).json({ success: false, message: error.message || 'Error hard deleting card' });
  }
};

export const restoreAllCards = async (req, res) => {
  try {
    const count = await cardService.restoreAllCards(req.user.id);
    res.status(200).json({ success: true, message: `${count} cards restored` });
  } catch (error) {
    console.error('Restore all cards error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error restoring cards' });
  }
};

export const emptyTrash = async (req, res) => {
  try {
    const count = await cardService.emptyTrash(req.user.id);
    res.status(200).json({ success: true, message: `Trash emptied (${count} cards deleted)` });
  } catch (error) {
    console.error('Empty trash error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error emptying trash' });
  }
};
