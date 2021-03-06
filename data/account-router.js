const express = require('express');

const db = require('./dbConfig');

const router = express.Router();

router.get('/', ( req, res ) => {
  console.log(req.query.limit)
  const {limit, sortby, sortdir} = req.query;
  db('accounts')
  .limit(limit)
  .orderBy(sortby, sortdir)
  .then(accounts => {
    res.json(accounts);
  })
  .catch(err => {
    res.status(500).json({message: 'Failed to get a accounts'})
  });
});

router.get('/:id', ( req, res ) => {
  const { id } = req.params;

  db('accounts')
  .where({ id })
  .first()
  .then(accounts => {
      if(accounts){
        res.status(200).json({data: accounts});
    } else {
      res.status( 400 ).json({message: 'Could not find user with given id' });
    }
  })
  .catch ( err => {
    res.status(500).json({ message: 'Failed to get user' })
  })

});

router.post('/', ( req, res ) => {
  const data = req.body;
  db('accounts')
  .insert(data)
  .then(data => {
    res.status(201).json(data)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to create new post', err })
  })
});

router.put('/:id', ( req, res ) => {
  const { id } = req.params;
  const changes = req.body;
  db('accounts')
  .where({id})
  .update(changes)
  .then( obj => {
    if(obj){
      res.json({updated: obj});
    }else{
      res.status(400).json({message: 'Could not update account with id'})
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'error updating', err});
  })
});

router.delete('/:id', ( req, res ) => {
  const { id } = req.params;
  db('accounts')
  .where({id})
  .del()
  .then(obj => {
    if(obj > 0){
    res.status(200).json({message: 'Account was deleted'})
  }else{
    res.status(400).json({message: 'Could not find post with that id'})
  }
  })
  .catch(err => {
    res.status(500).json({message: 'Error deleting account', err})
  })
});

module.exports = router;