const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");
const protect = require("../middleware/auth");

const router = express.Router();

// ✅ GET /transactions - Fetch All Transactions with Pagination & Sorting
router.get("/", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || "payment_time";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const status = req.query.status;
    const gateway = req.query.gateway;
    const search = req.query.search;

    // Build match conditions for filtering
    const matchConditions = {};
    
    if (status && status !== "all") {
      matchConditions.status = { $regex: new RegExp(status, "i") };
    }
    
    if (search) {
      matchConditions.$or = [
        { collect_id: { $regex: new RegExp(search, "i") } },
        { custom_order_id: { $regex: new RegExp(search, "i") } },
        { "orderData.school_id": { $regex: new RegExp(search, "i") } }
      ];
    }

    // Gateway filter needs to be applied after lookup
    const gatewayMatch = {};
    if (gateway && gateway !== "all") {
      gatewayMatch["orderData.gateway_name"] = { $regex: new RegExp(gateway, "i") };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "orderData"
        }
      },
      { $unwind: "$orderData" },
      
      // Apply initial filters
      ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
      
      // Apply gateway filter after lookup
      ...(Object.keys(gatewayMatch).length > 0 ? [{ $match: gatewayMatch }] : []),
      
      // Project fields
      {
        $project: {
          collect_id: 1,
          status: 1,
          payment_time: 1,
          bank_reference: 1,
          order_amount: 1,
          transaction_amount: 1,
          school_id: "$orderData.school_id",
          gateway: "$orderData.gateway_name",
          custom_order_id: 1,
          // Add computed fields for sorting
          payment_time_sort: {
            $cond: {
              if: { $ne: ["$payment_time", null] },
              then: "$payment_time",
              else: new Date(0) // Default date for null values
            }
          }
        }
      }
    ];

    // Get total count for pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await OrderStatus.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Build sort object
    let sortObj = {};
    
    // Map frontend sort fields to database fields (removed collect_id, school_id, gateway, status)
    const sortFieldMap = {
      "payment_time": "payment_time_sort",
      "order_amount": "order_amount",
      "transaction_amount": "transaction_amount"
    };

    const dbSortField = sortFieldMap[sortField] || "payment_time_sort";
    sortObj[dbSortField] = sortOrder;

    // Add sorting, pagination to pipeline
    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      // Remove the helper sort field from final output
      {
        $project: {
          collect_id: 1,
          status: 1,
          payment_time: 1,
          bank_reference: 1,
          order_amount: 1,
          transaction_amount: 1,
          school_id: 1,
          gateway: 1,
          custom_order_id: 1
        }
      }
    );

    // Execute the aggregation
    const transactions = await OrderStatus.aggregate(pipeline);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`API response: ${transactions.length} transactions (Page ${page}/${totalPages})`);
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      // Legacy support
      count: transactions.length
    });

  } catch (err) {
    console.error("Fetch Transactions Error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
      details: err.message
    });
  }
});

// ✅ GET /transactions/export - Export All Transactions (without pagination)
router.get("/export", protect, async (req, res) => {
  try {
    const status = req.query.status;
    const gateway = req.query.gateway;
    const search = req.query.search;

    // Build match conditions for filtering (same as main endpoint)
    const matchConditions = {};
    
    if (status && status !== "all") {
      matchConditions.status = { $regex: new RegExp(status, "i") };
    }
    
    if (search) {
      matchConditions.$or = [
        { collect_id: { $regex: new RegExp(search, "i") } },
        { custom_order_id: { $regex: new RegExp(search, "i") } },
        { "orderData.school_id": { $regex: new RegExp(search, "i") } }
      ];
    }

    const gatewayMatch = {};
    if (gateway && gateway !== "all") {
      gatewayMatch["orderData.gateway_name"] = { $regex: new RegExp(gateway, "i") };
    }

    const pipeline = [
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "orderData"
        }
      },
      { $unwind: "$orderData" },
      
      ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
      ...(Object.keys(gatewayMatch).length > 0 ? [{ $match: gatewayMatch }] : []),
      
      {
        $project: {
          collect_id: 1,
          status: 1,
          payment_time: 1,
          bank_reference: 1,
          order_amount: 1,
          transaction_amount: 1,
          school_id: "$orderData.school_id",
          gateway: "$orderData.gateway_name",
          custom_order_id: 1
        }
      },
      { $sort: { payment_time: -1 } } // Default sort for export
    ];

    const transactions = await OrderStatus.aggregate(pipeline);

    console.log(`Export response: ${transactions.length} transactions`);
    
    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });

  } catch (err) {
    console.error("Export Transactions Error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to export transactions",
      details: err.message
    });
  }
});

module.exports = router;