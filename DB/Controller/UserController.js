// For getting the attendance of the user from the database
import { supabase } from '../db.js'

export const getUserAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
//Function to call our python yolo model to put the attendance of the user in the database
export const markAttendance = async (req, res) => {
    try {
        const { userId, status, image } = req.body;

        // Logic to call Python YOLO model would typically happen here via a child process or external API
        // For this controller, we assume the model has validated the user and we insert the record
        // External API call to Python YOLO model
        const modelResponse = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: image, userId: userId })
        });

        const modelResult = await modelResponse.json();

        if (!modelResult.verified) {
            return res.status(401).json({
                success: false,
                message: 'Face verification failed'
            });
        }


        const { data, error } = await supabase
            .from('attendance')
            .insert([
                { 
                    user_id: userId, 
                    status: status || 'present', 
                    timestamp: new Date().toISOString() 
                }
            ]);

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

