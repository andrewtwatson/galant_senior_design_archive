import './Navbar.scss';

import { NavLink } from "react-router-dom";
import { asset } from 'util/assets';

/**
 * This holds the top Navbar for all parts of the website.
 */
function Navbar(props) {

    return (
        <nav className='navbar'>
            <div className='nav_container'>
                <div className='logo'>
                    <NavLink to="/" className="navbar__content__logo">
                        <img id='galant_logo' src={asset('/img/galant_full_logo_without_words.svg')} alt='The logo for Galant'/>
                    </NavLink>
                </div>
                <div className='nav-elements'>
                    <ul>
                        <li><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/collection'>Collection</NavLink></li>
                        <li><NavLink to='/tests'>Tests</NavLink></li>
                        <li><NavLink to='https://drive.google.com/drive/u/1/folders/1o-Yqo1NH4WSr9GLRDciCoCvpugwhh7JB'>Documentation</NavLink></li>
                        <li>
                            <NavLink to='https://github.com/andrewtwatson/galant_senior_design_archive' target="_blank">
                                <img id='github_logo' src={asset('/img/github-mark.png')} alt='Github logo' />
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );

}

export default Navbar;