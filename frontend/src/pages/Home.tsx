import Stickies from '../components/stickies';
import '../styles/home.css'

const Home = () => {
    return (
        <div>
            <div className="main-head-box">
                <div className="main-head-subbox-left">
                    <h1 className="main-head">kohngrüti</h1>
                </div>
                <div className="main-head-subbox-right">
                    <span className="material-symbols-outlined">recenter</span>
                </div>
            </div>
            <div>
                <Stickies />
            </div>
        </div>
    );
};

export default Home;