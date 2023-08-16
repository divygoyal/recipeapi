const mongoose = require("mongoose")
const recipeschema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
      },
      description: {
        type: String,
        required: 'This field is required.'
      },
      email: {
        type: String,
        required: 'This field is required.'
      },
      ingredients: {
        type: Array,
        required: 'This field is required.'
      },
      category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian'],
        required: 'This field is required.'
      },
      imageurl: {
        type: String,
        required: 'This field is required.'
      },
})
recipeschema.index({name:'text' , description:'text'});
const User = mongoose.model('RECIPE',recipeschema);
module.exports  = User;