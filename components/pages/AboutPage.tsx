"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import GetAllPages from "./GetAllPages";
import { AnnotatorPlugin } from "../annotationPlugin/AnnotatorPlugin";
import AboutNestcraft from "../aboutpage/aboutNestcraft/AboutNestcraft";
import OurStory from "../aboutpage/ourStory/OurStory";
import Difference from "../aboutpage/difference/Difference";
import OurProcess from "../aboutpage/ourProcess/OurProcess";
import DesignPhilosophy from "../aboutpage/designPhilosophy/DesignPhilosophy";
import WhyChooseUs from "../aboutpage/whyChooseUs/WhyChooseUs";
import { resetPageComments } from "@/lib/store/comments/commentSlice";


const stats = [
  { value: "12+", label: "Years of Craftsmanship" },
  { value: "8k+", label: "Homes Furnished" },
  { value: "150+", label: "Design-Led Pieces" },
  { value: "24/7", label: "Customer Support" },
];



const AboutPage = () => {
  const { nestCraftUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  //update the page
  // useEffect(()=>{
  //   dispatch(resetPageComments())
  // },[])
  return (
    <>
      {/* commentsS Plugin */}
      {nestCraftUser?.role == "admin" && <AnnotatorPlugin />}
      {/* get all page from the database */}
      <GetAllPages />

      <div data-annotate-id="about-page-root" className="bg-background text-foreground">
        {/* HERO */}
        <AboutNestcraft />

        {/* STATS */}
        <section
          data-annotate-id="about-stats-section"
          className="border-b border-border bg-surface px-[5%] py-8"
        >
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-border bg-background px-6 py-6 text-center"
              >
                <div className="text-[34px] font-bold tracking-tight text-foreground">
                  {item.value}
                </div>
                <div className="mt-2 text-[13px] font-black uppercase tracking-[2px] text-muted">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STORY + MISSION */}
        <OurStory />

        {/* VALUES */}
        <Difference />

        {/* PROCESS */}
        <OurProcess />

        {/* MATERIALS / SHOWROOM */}
        <DesignPhilosophy />

        {/* ASSURANCES & CTA */}
        <WhyChooseUs />
      </div>
    </>
  );
};

export default AboutPage;
