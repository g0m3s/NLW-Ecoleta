import React, {FormEvent, ChangeEvent, useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import api from '../../services/api'
import axios from 'axios'
import moon from '../../assets/moon.png'
import cloud from '../../assets/cloud.webp'
import sun from '../../assets/sun.png'
import market from '../../assets/market.png'
import './style.css'
import '../createPoint/dark.css'

interface Item {
    id: number,
    name: string,
    imageUrl: string
}

interface Entity {
    id: number,
    name: string,
    image: string,
    city: string,
    email: string,
    latitude: number,
    longitude: number,
    uf: string,
    whatsapp: string
}

interface IbgeUFResponse {
    sigla: string
}

interface IbgeCityResponse {
    nome: string
}

const FindPoint = () => {

    const history = useHistory()
    const [items,setItems] = useState<Item[]>([])
    const [entitys,setEntity] = useState<Entity[]>([])
    const [ufs,setUfs] = useState<string[]>([])
    const [sectedUf, setSectedUf] = useState('')
    const [sectedCity, setSectedCity] = useState('')
    const [cities, setCities] = useState<string[]>([])
    const [result, setResult] = useState({display: "none"})
    const [selectedsItems, setSelectedsItems] = useState<number[]>([])

    useEffect(() => {

        api.get('items')
        .then( res => {
            setItems(res.data)
        })
        
    }, [])
    useEffect(() => {

        axios.get<IbgeUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then( res => {

            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials)

        })
        
    }, [])
    useEffect(() => {

        if (sectedUf != '') {
            
            axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sectedUf}/municipios`)
            .then( res => {

                const cityName = res.data.map( city => city.nome )
                setCities(cityName)

            })

        }
        
    }, [sectedUf])

    async function handleSubmit(event:FormEvent ) {

        event.preventDefault()

        const data = await api.get(`/points?city=${sectedCity}&uf=${sectedUf}&items=${selectedsItems}`)

        setResult({display: "block"})

        setEntity(data.data)

        // history.push('/')
    }
    function handleSelectedUf(event:ChangeEvent<HTMLSelectElement>) {

        const uf = event.target.value

        setSectedUf(uf)

    }
    function handleSelectedCity(event:ChangeEvent<HTMLSelectElement>) {

        const city = event.target.value

        setSectedCity(city)

    }
    function handleSelectItem(id:number) {

        const alReadySelected = selectedsItems?.findIndex( item => item === id)

        if (alReadySelected >= 0) {

            const filteredItems = selectedsItems?.filter(item => item !== id)
            setSelectedsItems(filteredItems)

        }else
            setSelectedsItems( [...selectedsItems, id])
        
    }
    function darkMode() {

        document.body.classList.toggle('dark')

        var icon = document.getElementById('iconChangeTheme')

        if (document.body.classList.value != "dark")
            icon?.setAttribute('src', sun)
        else
            icon?.setAttribute('src', moon)
        
    }

    return (

        <div id="page-create-point">

            <header>

                <Link to='/' >

                    <img src={logo} alt="Ecoleta"/>

                </Link>

                <a className="changeLabel" onClick={darkMode}>
                    <img src={sun} alt="sol" id="iconChangeTheme" />
                    <img src={cloud} alt="nuvem" id="cloud1" />
                    <img src={cloud} alt="nuvem" id="cloud2" />
                </a>

            </header>

            <main>

                <form onSubmit={handleSubmit}>

                    <h2>Selecione o endereço para pesquisa</h2>

                    <div className="field-group">

                        <div className="field">

                            <label htmlFor="uf">Estado (UF)</label>

                            <select name="uf" id="uf" onChange={handleSelectedUf} value={sectedUf} >

                                <option value="0">Selecione um estado</option>

                                {ufs.map( uf => ( 

                                    <option key={uf} value={uf}>{uf}</option>

                                ) )}

                            </select>

                        </div>

                        <div className="field">

                            <label htmlFor="city">Cidade</label>

                            <select name="city" id="city" value={sectedCity} onChange={handleSelectedCity} >

                                <option value="0">Selecione uma cidade</option>

                                {cities.map( city => ( 

                                    <option key={city} value={city}>{city}</option>

                                ) )}

                            </select>

                        </div>

                    </div>

                    <fieldset>

                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid" >

                        {items.map( item => (

                            <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedsItems?.includes(item.id) ? 'selected': ''} >

                                <img src={item.imageUrl} alt={item.name} />
                                <span>{item.name}</span>

                            </li>

                        ))}

                    </ul>

                </fieldset>

                    <button type="submit"> Procurar por ponto de Coleta </button>

                    <div style={result} className="result">
                        
                        <h2>Resultados da busca:</h2>

                    </div>


                    <section>

                        {entitys.map( item => (

                            <div className="entity">

                                <h3>{item.name}</h3>

                                <img src={market} alt=""/>
                                {/* <img src={item.image} alt=""/> */}

                                <div className="contact">

                                    <h4>Contato:</h4>

                                    <p>{item.email}</p>
                                    <p>{item.whatsapp}</p>

                                </div>

                            </div>

                        ))}

                    </section>

                </form>

            </main>

        </div>

    )

}

export default FindPoint