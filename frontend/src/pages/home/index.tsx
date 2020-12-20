import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import './style.css'


const Home = () => {

    const find = { background: "#322153"}

    return (

        <div id="page-home" >

            <div className="content" >

                <header>
                    <img src={logo} alt="ecoleta"/>
                </header>

                <main>

                    <h1>Seu marketplace de coleta de resíduos.</h1>

                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/find-point" style={find}>

                        <span>
                            <FiLogIn />
                        </span>

                        <strong>Encontre um ponto de coleta</strong>

                    </Link>

                    <Link to="/create-point">

                        <span>
                            <FiLogIn />
                        </span>

                        <strong>Cadaste um ponto de coleta</strong>

                    </Link>

                </main>

            </div>

        </div>

    )

}

export default Home