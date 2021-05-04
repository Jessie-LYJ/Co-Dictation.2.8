const express = require('express')
const Model = require('../model/Version')
const router = express.Router()

router.get('/', function (req, res) {
    req.body = 'this is a users response!'
})

router.post('/add', async function (req, res) {
    console.log(req.body)
    let model = new Model(req.body);
    model = await model.save();
    console.log('user', model)
    res.send(model)
})

router.post('/find', async function (req, res) {
    const list = await Model.find()
    res.send(list)
})

router.post('/get', async function (req, res) {
    _id = req.body._id
    let model = await Model.findById(_id)
    res.send(model)
})

router.post('/update', async function (req, res) {
    console.log(req.body)
    let pbj = await Model.update({ _id: req.body._id }, req.body);
    res.send(pbj)
})
router.post('/delete', async function (req, res) {
    console.log(req.body)
    await Model.remove({ _id: req.body._id });
    res.send('成功')
})

router.post('/sort', async function (req, res) {
    console.log(req.body)
    var order = req.body.order
    var sortClass = req.body.prop
    var model = null
    if (order === 'ascending') {
        model = await Model.find({}).sort({ [sortClass]: 1 });
    } else {
        model = await Model.find({}).sort({ [sortClass]: -1 });
    }
    res.send(model)
})

router.post('/filter', async function (req, res) {
    console.log(req.body)
    var Qlist = req.body
    var model = null
    if (Qlist.name == '' && Qlist.taskId != '') {
        model = await Model.find({ taskId: Qlist.taskId });
    }
    else if (Qlist.name != '' && Qlist.taskId == '') {
        model = await Model.find({ name: Qlist.name });
    } else {
        model = await Model.find({ name: Qlist.name, taskId: Qlist.taskId });
    }
    res.send(model)
})

module.exports = router
