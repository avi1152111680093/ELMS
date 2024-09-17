import React, { useState } from "react";
import { Button, FormControl, Snackbar, Alert, Chip } from "@mui/material";
import axios from "axios";

function MessagesPage() {
  const [selectedFile, setSelectedFile] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const handleSubmitFiles = () => {
    console.log(selectedFile);
    const form_data = new FormData();
    form_data.append("leave_files", selectedFile);
    const requestOptions = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        // "Access-Control-Allow-Origin": "*",
      },
      body: form_data,
    };
    fetch("http://127.0.0.1:8000/leaves/file-upload", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
      });
    // axios({
    //   url: "http://127.0.0.1:8000/leaves/file-upload",
    //   method: "POST",
    //   data: form_data,
    // }).then((res) => {});
  };

  return (
    <>
      <form encType="multipart/form-data">
        <Button
          variant="outlined"
          component="label"
          size="small"
          style={{
            width: 200,
          }}
        >
          Upload File
          <input
            type="file"
            name="leave_files"
            multiple
            onChange={(e) => {
              if (!e.target.files[0]) return;
              const file = [...e.target.files];
              setSelectedFile(file);
              setIsFilePicked(true);
            }}
            hidden
          />
        </Button>
      </form>
      <div>
        {isFilePicked &&
          selectedFile.map((file, idx) => {
            return (
              <Chip
                key={idx}
                style={{
                  marginTop: 5,
                }}
                label={file.name}
              />
            );
          })}
      </div>
      <Button color="primary" onClick={handleSubmitFiles}>
        Apply Leave
      </Button>
    </>
  );
}

export default MessagesPage;
