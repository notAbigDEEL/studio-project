const express = require('express')
const {getStudios, 
       getStudio, 
       createStudio, 
       updateStudio, 
       deleteStudio} = require('../controllers/studios')

const router = express.Router()


router.route('/')
      .get(getStudios)
      .post(createStudio)

router.route('/:id')
      .get(getStudio)
      .put(updateStudio)
      .delete(deleteStudio)



module.exports = router