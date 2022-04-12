import {Routes, BrowserRouter, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home"


const Router = () => {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route element={<Home/>} index />
            </Route>
        </Routes>
    </BrowserRouter>
    );
};

export default Router;