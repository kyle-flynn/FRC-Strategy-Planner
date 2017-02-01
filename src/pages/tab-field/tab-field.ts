/**
 * Created by Kyle Flynn on 1/26/2017.
 */

import { Component, ViewChild } from '@angular/core';

import { NavController, Content } from 'ionic-angular';
import { ConnectionManager } from "../../util/connection-manager";
import { Canvas } from "./canvas";
import { Style } from "../../util/style";

@Component({
  selector: 'page-field',
  templateUrl: 'tab-field.html'
})
export class FieldPage {

  @ViewChild(Content) page_content: Content;

  connection: ConnectionManager;

  canvas_manager: Canvas;

  content: any;
  canvas_img: any;

  last_palette: any;

  draw_mode: string;

  color: string;
  red: number;
  green: number;
  blue: number;
  size: number;

  constructor(public navCtrl: NavController) {
    this.connection = new ConnectionManager();

    this.color = "";
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.size = 3;
    this.draw_mode = "pencil";
  }

  ionViewDidEnter() {
    this.content = document.getElementById("content");
    this.canvas_img = document.getElementById("canvas-img");
    this.canvas_manager = new Canvas(this.page_content, this.content, this.canvas_img);

    this.updateColor();
    this.updateSize();
    setTimeout(() => {
      this.canvas_manager.resize();
      this.openViewPalette();
      Style.fadeIn("canvas-img");
    }, 100);
  }

  public openViewPalette() {
    this.last_palette = "view-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    this.canvas_manager.updateMode("view");
    document.getElementById("view-btn").classList.add("active-menu");
  }

  public openDrawPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("draw-palette");
    this.canvas_manager.updateMode("draw");
    document.getElementById("draw-btn").classList.add("active-menu");
  }

  public openFieldPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("field-palette");
    this.canvas_manager.updateMode("field");
    document.getElementById("field-btn").classList.add("active-menu");
  }

  public openRobotPalette() {
    this.resetPalettes();
    this.resetMenuButtons();
    this.openPalette("robot-palette");
    this.canvas_manager.updateMode("robot");
    document.getElementById("robot-btn").classList.add("active-menu");
  }

  public openSavePalette() {
    this.last_palette = "save-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    document.getElementById("save-btn").classList.add("active-menu");
    this.saveCanvas();
  }

  public openFilePalette() {
    this.last_palette = "file-palette";
    this.resetPalettes();
    this.resetMenuButtons();
    document.getElementById("open-btn").classList.add("active-menu");
    this.openFileModal();
  }

  public updateDrawMode() {
    this.canvas_manager.setDrawMode(this.draw_mode);
  }

  private resetPalettes() {
    let palettes = document.getElementsByClassName("palette");

    for (let i = 0; i < palettes.length; i++) {
      palettes[i].classList.remove("palette-down");
      palettes[i].classList.add("palette-up");
    }
    this.canvas_manager.setEditable(true);
  }

  private resetMenuButtons() {
    let buttons = document.getElementsByClassName("menu-button");

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active-menu");
    }
  }

  private openPalette(id) {
    console.log(this.last_palette + " | " + id);
    if (this.last_palette != id) {
      let palette = document.getElementById(id);
      palette.classList.remove("palette-up");
      palette.classList.add("palette-down");
      this.canvas_manager.setEditable(false);
      this.last_palette = id;
    } else {
      this.last_palette = "null";
    }
  }

  saveCanvas() {

  }

  openFileModal() {

  }

  updateSize() {
    this.canvas_manager.updateSize(this.size);
  }

  updateColor() {
    this.canvas_manager.updateColor(this.red, this.green, this.blue);
    this.color = "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    document.getElementById("color-val").style.background = this.color;
  }

}
