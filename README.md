# 📘 YOLO‑based Face‑Recognition Attendance System

This is a simple prototype that uses **YOLO‑v8** for person tracking and **face_recognition** for identifying students from a webcam feed.  
When a known face appears,  the system logs the student’s name, tracking ID, and timestamp to an Excel file.


## 🔍 Features

- 🎥 Real‑time video capture from a webcam.
- 🧠 Person detection and tracking using a YOLOv8 model.
- 🙂 Face identification via pre‑loaded student images.
- 🗂 Logs attendance to `attendance_log.xlsx` (one entry per student per day).
- 📁 Automatically loads all images stored in `student_images/` (name = filename).

---

## 🛠️ Requirements

- Python 3.8+
- Packages (install with `pip`):

```bash
pip install opencv-python pandas face_recognition ultralytics openpyxl
```

> **Note:** You’ll also need a working webcam and the YOLO model file (`yolov8n.pt` in this repo).  
> A face‑specific model (`yolov8n-face.pt`) is attempted first; if it’s missing the code will fall back to the generic `yolov8n.pt`.

---

## 📁 Project Structure

```
Prototype/
├── main.ipynb               # primary Python notebook with YOLOAttendanceSystem class
├── yolov8n.pt               # YOLOv8 model weights
├── student_images/          # put student photos here (jpg/png)
├── attendance_log.xlsx      # generated after running 
```

---

## 🚀 Running the System

1. **Populate** `student_images/` with one image per student.  
   Name each file after the student (e.g. `Alice.jpg`).

2. **Launch** the notebook or convert the class into a script.  
   To run directly:

   ```bash
   python main.py   # if you convert the notebook to a script
   ```

   Or open `main.ipynb` and execute the cells.

3. The system opens a window showing the camera feed.  
   - Detected/tracked persons receive a bounding box and ID.
   - Recognized faces are labelled with the student’s name.
   - Press **q** to quit.

4. **Check** `attendance_log.xlsx` for today’s records.

---

## 📝 Notes & Tips

- The log prevents duplicate entries for the same student on the same date.
- If the YOLO‑face model isn’t available, the fallback detects generic “person” boxes.
- The repository already ignores the virtual environment located in `black/` via `.gitignore`.

---

## 📦 Extending the Prototype

- 🔄 Add support for video files or IP cameras.
- ⏱️ Timestamp format or CSV export options.
- 🔒 Integrate with a database or web dashboard.

---

Happy prototyping!  
Feel free to tweak the notebook, swap models, or embed this class in a larger app.
