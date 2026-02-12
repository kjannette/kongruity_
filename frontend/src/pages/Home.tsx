import Stickies from '../components/stickies';
import '../styles/home.css'

const Home = () => {
    return (
        <div>
            <div className="main-head-box">
                <div>
                    <h1 className="mainHead">kohngrüti</h1>
                </div>
                <div>

                </div>
            </div>
            <div>
                <Stickies />
            </div>
        </div>
    );
};

export default Home;