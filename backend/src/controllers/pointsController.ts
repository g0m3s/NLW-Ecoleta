import knex from '../database/connection'
import {Request, Response} from 'express'

class PointsController {

    async index (req:Request, res:Response) {

        const { city, uf, items } = req.query

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()))

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.pont_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        res.json(points)

    }

    async show (req:Request, res:Response) {

        const id = req.params.id

        const point = await knex('points').where('id', id).first()

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.pont_id', id)
        .select('items.title')

        if (!point)
            return res.status(400).json({message: 'point not found'})
        else
            return res.json({point, items})

    }

    async create (req:Request, res:Response) {

        const {
    
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
    
        } = req.body
     
        const trx = await knex.transaction()

        const point = {
    
            image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
    
        }
    
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map( (item_id:number) => {
    
            return {
    
                item_id,
                pont_id: point_id
    
            }
    
        })
    
        await trx('point_items').insert(pointItems)

        await trx.commit()
    
        return res.json({
            
            id: point_id,
            ... point

        })    
    
    }

}

export default PointsController