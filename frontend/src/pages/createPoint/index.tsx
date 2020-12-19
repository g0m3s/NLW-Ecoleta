import React, {useEffect, useState, ChangeEvent, useRef, useMemo, useCallback, FormEvent} from 'react'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import moon from '../../assets/moon.png'
import cloud from '../../assets/cloud.webp'
import sun from '../../assets/sun.webp'
import './style.css'
import './dark.css'

interface Item {
    id: number,
    name: string,
    imageUrl: string
}

interface IbgeUFResponse {
    sigla: string
}

interface IbgeCityResponse {
    nome: string
}

const CreatePoint = () => {

    const [items,setItems] = useState<Item[]>([])
    const [ufs,setUfs] = useState<string[]>([])
    const [sectedUf, setSectedUf] = useState('')
    const [sectedCity, setSectedCity] = useState('')
    const [cities, setCities] = useState<string[]>([])
    const [formData, setFormData] = useState({

        name: '',
        email: '',
        whatsapp: ''

    })
    const [selectedsItems, setSelectedsItems] = useState<number[]>([])
    const markerRef = useRef<any>(null)

    const center = {
        lat: -21.6956928,
        lng: -41.3073408,
    }

    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)

    const history = useHistory()

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

    function DraggableMarker() {

        const eventHandlers = useMemo(
          () => ({
            dragend() {
              const marker = markerRef.current
              if (marker != null) {
                setPosition(marker.getLatLng())
                console.log(position)
              }
            },
          }),
          [],
        )
        const toggleDraggable = useCallback(() => {
          setDraggable((d) => !d)
        }, [])
      
        return (
          <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}>
            <Popup minWidth={90}>
              <span onClick={toggleDraggable}>
                {draggable
                  ? 'Escolha o local'
                  : 'Clique aqui para mudar a localização'}
              </span>
            </Popup>
          </Marker>
        )
    }

    function handleSelectedUf(event:ChangeEvent<HTMLSelectElement>) {

        const uf = event.target.value

        setSectedUf(uf)

    }
    function handleSelectedCity(event:ChangeEvent<HTMLSelectElement>) {

        const city = event.target.value

        setSectedCity(city)

    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const {name, value} = event.target
        setFormData({

            ...formData, [name]: value

        })
        
    }

    function handleSelectItem(id:number) {

        const alReadySelected = selectedsItems?.findIndex( item => item === id)

        if (alReadySelected >= 0) {

            const filteredItems = selectedsItems?.filter(item => item !== id)
            setSelectedsItems(filteredItems)

        }else
            setSelectedsItems( [...selectedsItems, id])
        
    }

    async function handleSubmit(event:FormEvent ) {

        event.preventDefault()

        const {name, email, whatsapp} = formData
        const uf = sectedUf
        const city = sectedCity
        const latitude = position.lat
        const longitude = position.lng
        const items = selectedsItems

        const data = {

            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items

        }
        
        await api.post('/points', data)

        alert('Ponto de coleta cadastrado com sucesso!')

        history.push('/')
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

            <form onSubmit={handleSubmit} >

                <h1>Cadastro do <br/> ponto de Coleta</h1>

                <fieldset>

                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field" >

                        <label htmlFor="name"> Nome da entidade </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />

                    </div>

                    <div className="field-group" >

                        <div className="field" >

                            <label htmlFor="email"> E-mail </label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />

                        </div>

                        <div className="field" >

                            <label htmlFor="whatsapp"> Whatsapp </label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />

                        </div>

                    </div>

                </fieldset>

                <fieldset>

                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker />
                    </MapContainer>

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

                </fieldset>

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

                <button type="submit"> Cadastrar ponto de coleta </button>

            </form>

        </div>

    )

}

export default CreatePoint