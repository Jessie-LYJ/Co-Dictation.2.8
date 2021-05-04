const express = require('express')
const Model = require('../model/Tag')
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
    if (Qlist.owner == '' && Qlist.tagName != '') {
        model = await Model.find({ tagName: Qlist.tagName });
    }
    else if (Qlist.owner != '' && Qlist.tagName == '') {
        model = await Model.find({ owner: Qlist.owner });
    } else {
        model = await Model.find({ owner: Qlist.owner, tagName: Qlist.tagName });
    }
    res.send(model)
})

router.post('/updateList', async (req, res) => {
    const list = await User.find({ _id: req.body.params._id })
    
    await Model.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            userList: list
        }
    }, err => {
        if (err) {
            console.log("Error:", err)
        } else {
            console.log("list更新成功, Res: ", res)
        }
    })
}),

module.exports = router
