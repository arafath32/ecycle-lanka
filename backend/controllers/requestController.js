const Request = require('../models/Request');

// ─────────────────────────────────────────
// CREATE REQUEST
// Buyer posts what they are looking for
// ─────────────────────────────────────────
const createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      location,
      urgency,
      contactMethod,
      contactInfo,
    } = req.body;

    if (!title || !description || !category || !budget || !location || !contactInfo) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const request = new Request({
      title,
      description,
      category,
      budget: Number(budget),
      location,
      urgency,
      contactMethod,
      contactInfo,
      buyer: req.user._id, // logged in user is the buyer
    });

    await request.save();

    res.status(201).json({
      message: 'Request posted successfully',
      request,
    });
  } catch (error) {
    console.log('Create request error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET ALL OPEN REQUESTS
// Sellers browse this to find buyers
// Only shows 'open' requests — filled/closed are hidden
// ─────────────────────────────────────────
const getRequests = async (req, res) => {
  try {
    const { category, urgency, location, search } = req.query;

    // Always filter by open status — public only sees active requests
    const filter = { status: 'open' };

    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (location) filter.location = location;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await Request.find(filter)
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.log('Get requests error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET SINGLE REQUEST
// Seller clicks on a request to see full details
// ─────────────────────────────────────────
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('buyer', 'name email profileImage');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ request });
  } catch (error) {
    console.log('Get request error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET MY REQUESTS
// Buyer sees their own posted requests
// ─────────────────────────────────────────
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.log('Get my requests error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// UPDATE REQUEST STATUS
// Buyer marks request as filled or closed
// Example: found the item they needed
// ─────────────────────────────────────────
const updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only the buyer who posted can update status
    if (request.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    request.status = status;
    await request.save();

    res.status(200).json({ message: 'Request updated successfully', request });
  } catch (error) {
    console.log('Update request error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// DELETE REQUEST
// Buyer removes their own request
// ─────────────────────────────────────────
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only the buyer OR admin can delete
    if (
      request.buyer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.log('Delete request error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  getMyRequests,
  updateRequestStatus,
  deleteRequest,
};