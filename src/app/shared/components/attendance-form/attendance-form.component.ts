import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'app-attendance-form',
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.scss',
})
export class AttendanceFormComponent {
  photoPreview: string | ArrayBuffer | null = null;
  photoFile: File | null = null;
  cameraOn = true;
  dateTimestamp = new Date();

  localizacao: { latitude: number; longitude: number } | null = null;

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;

  constructor(private dialogRef: MatDialogRef<GroupFormComponent>) {}

  ngOnInit() {
    this.startCamera();
    this.getUserLocation();
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.stream = stream;
        this.videoRef.nativeElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Erro ao acessar a câmera', err);
        alert('Não foi possível acessar a câmera.');
      });
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.localizacao = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log('Localização obtida:', this.localizacao);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  }

  takePhoto() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    this.photoPreview = dataUrl;
    this.photoFile = this.dataURItoFile(dataUrl, 'foto.png');

    this.cameraOn = false;
    this.stopCamera();
  }

  dataURItoFile(dataURI: string, filename: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mimeString });
  }

  onSubmit() {
    this.takePhoto();
    if (!this.photoFile) return;

    this.dialogRef.close({
      imagem: this.photoFile,
      latitude: this.localizacao?.latitude,
      longitude: this.localizacao?.longitude,
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
