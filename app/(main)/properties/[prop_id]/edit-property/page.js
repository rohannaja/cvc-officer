"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../../properties.module.css";
import editprop from "./editprop.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

export default function EditProperty() {
    const [propertyData, setPropertyData] = useState(null);
    const params = useParams();  // Use useParams to get dynamic route params
    const prop_id = params.prop_id; // Get prop_id from the URL 
    
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (prop_id) {
        // Determine the API URL based on the environment
         // Default to localhost if no environment variable is set

        
        // Make sure the endpoint matches your API route
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/officer/properties/${prop_id}`)
            .then((res) => res.json())
            .then((data) => setPropertyData(data))
            .catch((error) => console.error('Error fetching property data:', error));
        }
    }, [prop_id]); // Re-run the effect when prop_id changes


    if (!propertyData) {
        return <div>No property data retrieved.</div>;
    }

    return (
        <div className={properties.main_content_container}>
            <div className={editprop.main_content_div}>
                
                {!showSummaryModal && !isProcessing && (
                    <>
                        <div className={editprop.content_div_cta_row}>
                            <Link href={`/properties/${prop_id}`} className={editprop.backbtn_cont}>
                                <div className={editprop.backbtn_img_div}>
                                    <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                                </div>
                                <p>Back</p>
                            </Link>
                        </div>

                        <div className={editprop.main_content_title_div}>
                            <h3 className={editprop.content_title}>Edit Property</h3>
                        </div>

                        <div className={editprop.main_propinf_container}>
                            <div className={editprop.propinf_img_div}>
                                <Image className={editprop.propinf_info_img} 
                                src={propertyData.prop_image_url} 
                                alt="House Photo"
                                layout="responsive"
                                width={500}
                                height={280} />
                            </div>
                        </div>
                    
                    
                    </>
                )}
            </div>
        </div>
    )
}