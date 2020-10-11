const express = require("express");
const router = express.Router();
const redis = require("redis");
const { REDIS_PORT } = require("../config");
const redisClient = redis.createClient(REDIS_PORT);

router.post("/addHexagon", (req, res, next) => {
  try {
    redisClient.get(req.body.id, (err, data) => {
      if (err) {
        console.log(err);
        next({
          status: 500,
          message: "Hexagon not found",
          err,
        });
      }
      if (data != null) {
        res
          .status(500)
          .json({
            success: true,
            message: "OK",
            data: "Initial Hexagon already found",
          });
      } else {
        redisClient.set(req.body.id, JSON.stringify(req.body.edge));
        res
          .status(201)
          .json({ success: true, message: "Hexagon added successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    next({
      status: 500,
      message: "Hexagon not added",
      error,
    });
  }
});

router.get("/getHexagon/:id", (req, res, next) => {
  if (req.params.id) {
    redisClient.get(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        next({
          status: 500,
          message: "Hexagon not found",
          err,
        });
      }
      if (data != null) {
        res
          .status(201)
          .json({ success: true, message: "OK", data: JSON.parse(data) });
      }
    });
  } else {
    next({
      status: 500,
      message: "Id should not be empty",
    });
  }
});

router.post("/updateHexagon", (req, res, next) => {
  if (req.body) {
    //   edge:this.edge,
    redisClient.get(req.body.id, (err, data) => {
      console.log(err, data);
      if (err) {
        console.log(err);
      }
      if (data != null) {
        next({
          status: 500,
          message: "Hexagon trying to add already exists",
        });
      } else {
        redisClient.get(req.body.exist_id, (err, data) => {
          if (err) {
            console.log(err);
            next({
              status: 500,
              message: "Parent hexagon not found",
            });
          }
          if (data != null) {
            dataUpdate(JSON.parse(data), req.body, res, next);
          } else {
            next({
              status: 500,
              message: "Parent hexagon not found",
            });
          }
        });
      }
    });
  } else {
    next({
      status: 500,
      message: "body should not be empty",
    });
  }
});

async function dataUpdate(nodeData, body, res, next) {
  let edge1 = {};
  let edge2 = {};
  let mappingOfEdges = { 0: 3, 1: 4, 2: 5, 3: 0, 4: 1, 5: 2 };
  nodeData[body.edge] = body.id;
  if (updateEachNode(nodeData)) {
    if (body.edge == 0) {
      edge1 = { id: nodeData[5], edgeno: 5 };
      edge2 = { id: nodeData[1], edgeno: 1 };
    } else if (body.edge == 5) {
      edge1 = { id: nodeData[4], edgeno: 4 };
      edge2 = { id: nodeData[0], edgeno: 0 };
    } else {
      edge1 = { id: nodeData[body.edge - 1], edgeno: body.edge - 1 };
      edge2 = { id: nodeData[body.edge + 1], edgeno: body.edge + 1 };
    }

    if (edge1.id == null && edge2.id == null) {
      let hexagon = {
        id: body.id,
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
      };
      hexagon[mappingOfEdges[body.edge]] = body.exist_id;
      if (updateEachNode(hexagon)) {
        res
          .status(201)
          .json({ success: true, message: "Hexagon added successfully" });
      } else {
        next({
          status: 500,
          message: "Error while adding",
        });
      }
    } else if (edge1.id != null && edge2.id != null) {
      let edgeDetails = await fetchMultipleData([edge1.id, edge2.id]);
      if (edgeDetails) {
        edgeDetails[0] = JSON.parse(edgeDetails[0]);
        edgeDetails[1] = JSON.parse(edgeDetails[1]);
        let hexagon = {
          id: body.id,
          0: null,
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
        };
        hexagon[mappingOfEdges[body.edge]] = body.exist_id;
        hexagon[edge1.edgeno - 1] = edge1.id;
        hexagon[edge2.edgeno + 1] = edge2.id;
        edgeDetails[0].id == edge1.id
          ? (edgeDetails[0][mappingOfEdges[edge1.edgeno - 1]] = body.id)
          : (edgeDetails[1][mappingOfEdges[edge1.edgeno - 1]] = body.id);
        edgeDetails[0].id == edge2.id
          ? (edgeDetails[0][mappingOfEdges[edge2.edgeno + 1]] = body.id)
          : (edgeDetails[1][mappingOfEdges[edge2.edgeno + 1]] = body.id);
        edgeDetails.push(hexagon);
        let formattedDetails = [];
        edgeDetails.forEach((element) => {
          formattedDetails.push(element.id);
          formattedDetails.push(JSON.stringify(element));
        });
        if (await setMultipleKeys(formattedDetails)) {
          res
            .status(201)
            .json({ success: true, message: "Hexagon added successfully" });
        } else {
          next({
            status: 500,
            message: "Error while adding",
          });
        }
      } else {
        next({
          status: 500,
          message: "Error while adding",
        });
      }
    } else if (edge1.id == null) {
      let edgeDetails = await fetchMultipleData([edge2.id]);
      if (edgeDetails) {
        edgeDetails[0] = JSON.parse(edgeDetails[0]);
        let hexagon = {
          id: body.id,
          0: null,
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
        };
        hexagon[mappingOfEdges[body.edge]] = body.exist_id;
        hexagon[edge2.edgeno + 1] = edge2.id;
        edgeDetails[0][mappingOfEdges[edge2.edgeno + 1]] = body.id;
        edgeDetails.push(hexagon);
        let formattedDetails = [];
        edgeDetails.forEach((element) => {
          formattedDetails.push(element.id);
          formattedDetails.push(JSON.stringify(element));
        });
        if (await setMultipleKeys(formattedDetails)) {
          res
            .status(201)
            .json({ success: true, message: "Hexagon added successfully" });
        } else {
          next({
            status: 500,
            message: "Error while adding",
          });
        }
      } else {
        next({
          status: 500,
          message: "Error while adding",
        });
      }
    } else if (edge2.id == null) {
      let edgeDetails = await fetchMultipleData([edge1.id]);
      if (edgeDetails) {
        edgeDetails[0] = JSON.parse(edgeDetails[0]);
        let hexagon = {
          id: body.id,
          0: null,
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
        };
        hexagon[mappingOfEdges[body.edge]] = body.exist_id;
        hexagon[edge1.edgeno - 1] = edge1.id;
        edgeDetails[0][mappingOfEdges[edge1.edgeno - 1]] = body.id;
        edgeDetails.push(hexagon);
        let formattedDetails = [];
        edgeDetails.forEach((element) => {
          formattedDetails.push(element.id);
          formattedDetails.push(JSON.stringify(element));
        });
        if (await setMultipleKeys(formattedDetails)) {
          res
            .status(201)
            .json({ success: true, message: "Hexagon added successfully" });
        } else {
          next({
            status: 500,
            message: "Error while adding",
          });
        }
      } else {
        next({
          status: 500,
          message: "Error while adding",
        });
      }
    }
  } else {
    next({
      status: 500,
      message: "Error while adding",
    });
  }
}

function fetchMultipleData(keys) {
  return new Promise((resv, rej) => {
    redisClient.mget(keys, (err, res) => {
      if (res) {
        resv(res);
      } else {
        resv(false);
      }
    });
  });
}

function setMultipleKeys(keys) {
  return new Promise((resv, rej) => {
    redisClient.mset(keys, (err, res) => {
      if (res) {
        resv(true);
      } else {
        resv(false);
      }
    });
  });
}

function updateEachNode(node) {
  try {
    redisClient.set(node.id, JSON.stringify(node));
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = router;
