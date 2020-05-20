import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Grid from "@material-ui/core/Grid";
import './Uploader.scss';

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);

    const size = parseInt(props.size);

    this.fileUploader = React.createRef();

    this.circleData = {
      radius: (size / 2) - (size * 0.08),
      center: {
        x: size / 2,
        y: size / 2
      }
    };
  }

  analyzeAudio() {
    const blob = window.URL || window.webkitURL;
    const file = this.fileUploader.current.files[0];
    console.log(this.fileUploader.current.files);
    const formData = new FormData();

    formData.append('files[]', file);
    const fileURL = blob.createObjectURL(file);

    fetch('/analyzeSong', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(chordsData => {
        console.log(chordsData);
        this.props.onUploaded({audioSrc: fileURL, chordsData: chordsData.data});
      }).catch(console.log);
  }

  render() {
    return (
      <div className="uploaderContainer" style={{
        height: `${this.props.size}px`,
      }}>
        <svg height={this.props.size} width={this.props.size} style={{
          position: 'absolute'
        }}>
          <circle
            cx={this.circleData.center.x} cy={this.circleData.center.y}
            r={this.circleData.radius} fill="transparent" stroke="red" strokeWidth={5}
          />
        </svg>
        <input
          accept="audio/*"
          type="file"
          ref={this.fileUploader}
          style={{
            display: 'none'
          }}
          onChange={() => this.analyzeAudio()}
        />
        <CloudUploadIcon
          style={{
            fontSize: `${this.props.size * 0.3}px`,
            position: 'absolute',
            top: `${this.circleData.center.y - (this.props.size * 0.15)}px`,
            color: 'red'
          }}
          onClick={() => {
            // this.analyzeAudio()
            // console.log(this.fileUploader.current)
            this.fileUploader.current.click()
          }}

        />
      </div>
    )
  }
}