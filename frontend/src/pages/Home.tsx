import Stickies from '../components/stickies';
import Navbar from '../components/navbar'
import '../styles/home.css'

const Home = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <Stickies />
            </div>
        </div>
    );
};

export default Home;