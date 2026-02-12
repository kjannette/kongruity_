import Stickies from '../components/stickies';

const Home = () => {
    return (
        <div>
            <div className="main-head-box">
                <h1 className="mainHead">kohngrüti</h1>
            </div>
            <div>
                <Stickies />
            </div>
        </div>
    );
};

export default Home;