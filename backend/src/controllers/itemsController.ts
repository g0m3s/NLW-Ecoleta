import knex from '../database/connection'
import {Request, Response} from 'express'

class ItemsController {

    async index (req:Request, res:Response) {
    
        const items = await knex("items").select('*')
    
        const serializedItems = items.map( item => {
    
            return {
    
                id: item.id,
                name: item.title,
                imageUrl: `http://localhost:3333/uploads/${item.image}`
    
            }
    
        })
    
        res.json(serializedItems)
    
    }

}

export default ItemsController