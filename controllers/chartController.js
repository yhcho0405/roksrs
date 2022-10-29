const asyncHandler = require("express-async-handler");
const UnitM = require("../models/unitModel");
const Chart = require("../models/chartModel");

//@description     Get organizational chart as array list
//@route           GET /api/chart
//@access          Protected
const getChart = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const currentUnit = await UnitM.findOne({ _id: currentUser.Unit });

  if (!currentUnit) {
    res.status(400);
    throw new Error('사용자의 부대가 설정되지 않았습니다.');
  }

  const unitOrganization = await Chart.find({ Unit: { $eq: currentUnit.Unitname } });
  if (unitOrganization.length === 0) {
    await Chart.create({
      Avatar: currentUser.pic,
      Name: currentUser.Name,
      Rank: currentUser.Rank,
      Unit: currentUnit.Unitname
    })
  }
  res.send(unitOrganization);
});

//@description     Add organizational chart
//@route           POST /api/chart/add
//@access          Protected
const addChart = asyncHandler(async (req, res) => {
  const {
    Avatar,
    Name,
    Rank,
    Unit,
    Position,
    DoDID,
    Number,
    MilNumber,
    Email,
    Parent
  } = req.body;

  if (!Name || !Rank || !Unit) {
    res.status(400);
    throw new Error("모든 정보를 입력하세요.");
  }

  const newChart = await Chart.create({
    Avatar,
    Name,
    Rank,
    Unit,
    Position,
    DoDID,
    Number,
    MilNumber,
    Email,
    Parent,
  });

  if (newChart) {
    res.status(201).json({
      _id: newChart._id,
      Avatar,
      Name,
      Rank,
      Unit,
      Position,
      DoDID,
      Number,
      MilNumber,
      Email,
      Parent: Parent ?? null,
    })
  }
  else {
    res.send(400);
    throw new Error('조직도를 추가/수정할 수 없습니다.')
  }
});

//@description     Edit organizational chart
//@route           POST /api/chart/edit
//@access          Protected
const editChart = asyncHandler(async (req, res) => {
  const {
    _id,
    Avatar,
    Name,
    Rank,
    Unit,
    Position,
    DoDID,
    Number,
    MilNumber,
    Email,
    Parent
  } = req.body;

  if (!_id || !Name || !Rank || !Unit) {
    res.status(400);
    throw new Error("모든 정보를 입력하세요.");
  }

  const updatedChart = await Chart.findByIdAndUpdate(_id, {
    Avatar,
    Name,
    Rank,
    Position,
    DoDID,
    Number,
    MilNumber,
    Email,
    Parent,
    Unit
  });

  if (updatedChart) {
    res.status(200).json({
      Avatar,
      Name,
      Rank,
      Position,
      DoDID,
      Number,
      MilNumber,
      Email,
      Parent,
      Unit
    })
  }
  else {
    res.send(400);
    throw new Error('조직도를 추가/수정할 수 없습니다.')
  }
});

//@description     Delete organizational chart
//@route           POST /api/chart/delete
//@access          Protected
const deleteChart = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    res.status(400);
    throw new Error("모든 정보를 입력하세요.");
  }

  const deleteChart = await Chart.findByIdAndDelete(_id);
  if (deleteChart) {
    res.send(200);
  }
  else {
    res.send(400);
    throw new Error('조직도를 추가/수정할 수 없습니다.')
  }
});

module.exports = {
  getChart,
  addChart,
  editChart,
  deleteChart
};