import express from 'express'
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

const routes = express.Router()
const pointsController = new PointsController
const itemsController = new ItemsController

routes.get('/items', itemsController.index)

routes.get('/points/:id', pointsController.show)

routes.get('/points', pointsController.index)

routes.post('/points', pointsController.create)

export default routes