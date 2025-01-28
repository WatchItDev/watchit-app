import * as Yup from 'yup';
import { useFormik } from 'formik';

// Project Imports
import { useBoolean } from '@src/hooks/use-boolean.ts';
import ProcessSectionCard from '@src/components/process-section-card.tsx';
import MarketingProcessModal from '@src/components/modal.tsx';
// @ts-ignore
import Marketing from '@src/assets/illustrations/marketing.svg';
import MarketingProcessContentModal from "@src/sections/marketing/components/marketing-process-content-modal.tsx";
import React from "react";

/**
 * `MarketingProcess` is a functional component that provides the user interface
 * and logic for creating and managing a marketing campaign. It includes
 * form handling, validation, and modal interactions for creating a campaign.
 *
 * This component allows users to:
 * - Register a campaign by filling out a form with key details such as
 *   description, budget, budget per user, maximum rate, and campaign type.
 * - Validate the form inputs using custom rules to ensure correctness.
 * - Submit the campaign data for further processing.
 * - Trigger and manage the visibility of modals for user interactions.
 */
const MarketingProcess = (): React.ReactNode => {
  const confirmPublish = useBoolean();

  const handleFinishPublish = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  const handleStoreCampaign = (values: any) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {
      description: '',
      budget: '',
      budgetUser: '',
      maxRate: '',
      campaignType: '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Please provide a campaign description.'),
      budget: Yup.number().required('Campaign budget is required.').positive('Budget must be positive.'),
      budgetUser: Yup.number().required('Budget per user is required.').positive('Must be positive.'),
      maxRate: Yup.number().required('Max rate is required.').positive('Must be positive.'),
      campaignType: Yup.string().required('Please select a campaign type.'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      handleStoreCampaign(values);

      setTimeout(() => {
        setSubmitting(false);
        handleFinishPublish();
        formik.resetForm();
      }, 2000);
    },
  });

  return (
    <>
      <ProcessSectionCard
        title="Start your marketing!"
        description="Boost your brand to the maximum. Launch campaigns and share your content with the world."
        buttonText="Create your campaign now!"
        illustration={Marketing}
        illustrationAlt="Watchit Marketing"
        onClick={handleClick}
      />
      <MarketingProcessModal
        title="Register a Campaign"
        open={confirmPublish.value}
        onClose={handleFinishPublish}
        renderContent={<MarketingProcessContentModal formik={formik} handleFinishPublish={handleFinishPublish} />
        }
      />
    </>
  );
};

export default MarketingProcess;
