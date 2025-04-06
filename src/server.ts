import app from './app';
import config from './config/config';
import connectDB from "./database";


app.listen(config.port, () => {
    connectDB();
    console.log(`Server is running on port ${config.port}`);
});
