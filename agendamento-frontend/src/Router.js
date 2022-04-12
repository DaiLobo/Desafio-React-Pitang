import {Routes, BrowserRouter, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Consult from "./pages/Consult";
import Home from "./pages/Home"
import Scheduling from "./pages/Scheduling";


const Router = () => {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route element={<Home/>} index />
                <Route path="/scheduling" element={<Scheduling/>} />
                <Route path="/consult" element={<Consult/>} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
};

export default Router;