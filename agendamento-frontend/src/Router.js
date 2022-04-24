import {Routes, BrowserRouter, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Appointment from "./pages/Appointment";
import Scheduling from "./pages/Scheduling";


const Router = () => {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route element={<Scheduling/>} index />
                {/* <Route path="/scheduling" element={<Scheduling/>} /> */}
                <Route path="/appointment" element={<Appointment/>} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
};

export default Router;