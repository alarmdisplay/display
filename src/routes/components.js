const express = require('express')
const router = express.Router()

/**
 * @param {ComponentService} componentService
 */
module.exports = function (componentService) {
  router.post('/', (req, res, next) => {
    componentService.createComponent(req.body.type || '', req.body.name || '')
      .then(component => {
        const baseUrl = req.originalUrl.replace(/\/$/, '')
        const newLocation = `${baseUrl}/${component.id}`
        res.set('Location', newLocation).status(201).json(component)
      })
      .catch(error => next(error))
  })

  router.get('/', (req, res, next) => {
    componentService.getAllComponents()
      .then(components => {
        res.json(components)
      })
      .catch(error => next(error))
  })

  router.get('/:id', (req, res, next) => {
    componentService.getComponent(parseInt(req.params.id))
      .then(component => {
        res.json(component)
      })
      .catch(error => next(error))
  })

  router.put('/:id', (req, res, next) => {
    componentService.getComponent(parseInt(req.params.id))
      .then(component => componentService.updateComponent(component.id, req.body.name || ''))
      .then(updatedComponent => res.json(updatedComponent))
      .catch(error => next(error))
  })

  router.delete('/:id', (req, res, next) => {
    componentService.deleteComponent(parseInt(req.params.id))
      .then(() => res.sendStatus(204))
      .catch(error => next(error))
  })

  return router
}
