// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router();


router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The posts information could not be retrieved',
      });
    });
})
  

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist'})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The post information could not be retrieved',
      });
    });
})


router.post('/', (req, res) => {
  const {title, contents} = req.body
  if (!title || !contents) {
    res.status(400).json({ message: 'Please provide title and contents for the post'})
  } else {
    Post.insert(req.body)
    .then(({ id }) => {
      return Post.findById(id)
    })
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The posts information could not be retrieved',
      });
    });
  }
})
  
  

router.put('/:id', (req, res) => {
  const {title, contents} = req.body
  if (!title || !contents) {
    res.status(400).json({ 
          message: 'Please provide title and contents for the post', 
        })
  } else {
    Post.findById(req.params.id)
      .then( possiblePost => {
        if(!possiblePost) {
          res.status(404).json({ 
          message: "The post with the specified ID does not exist",
      })
        } else {
          return Post.update(req.params.id, req.body)
          } 
      })
        .then(data => {
          if (data) {
            return Post.findById(req.params.id)
          }
        })
        .then(post => {
          if (post) {
            res.status(200).json(post);
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: 'The post information could not be modified',
          });
        });
  }
});
      

// | 5   | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**             


router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById (req.params.id) 
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist' });
    } else {
      await Post.remove(req.params.id)
      res.json(post)
    }
  } catch (error) {
    res.status(500).json({
      message: 'The post could not be removed',
    });
  }
});

// tried to make this work but couldn't

// router.delete('/:id', (req, res) => {
//   Post.findById(req.params.id)
//       .then( post => {
//         if(!post) {
//           res.status(404).json({ 
//           message: "The post with the specified ID does not exist",
//           })
//         } else {
//           return Post.remove(req.params.id)
//         }
//       })
//       .then(post => {
//         if (post) {
//           res.status(200).json(post);
//         }
//       })
//       .catch(error => {
//           console.log(error);
//           res.status(500).json({
//             message: 'The post could not be removed',
//           });
//         });
// })


router.get('/:id/comments', (req, res) => {
  Post.findPostComments(req.params.id)
    .then(comments => {
      if (!comments.length) {
        res.status(404).json({ message: 'The post with the specified ID does not exist'}) 
      } else {
        res.status(200).json(comments);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'The comments information could not be retrieved',
      });
    });
})

// async working too

// router.get('/:id/comments', async (req, res) => {
//   console.log('async/await version')
//   try {
//     const comments = await Post.findPostComments(req.params.id)
//     if (!comments.length) {
//       res.status(404).json({ message: 'The post with the specified ID does not exist' })
//     } else {
//       res.status(200).json(comments)
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'The comments information could not be retrieved',
//       rawError: err.message,
//     });
//   }
// });

module.exports = router;
