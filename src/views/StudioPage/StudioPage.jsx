"use client";

import React from "react";
import {Studio} from "sanity";
import config from "../../../studio/sanity.config.ts";
import "./StudioPage.css";

export default function StudioPage() {
  return (
    <div className="studio-root">
      <Studio config={config} />
    </div>
  );
}
