import { useState } from 'react';
// material
import { Box, Step, Paper, Button, Stepper, StepLabel, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { FormOne, FormThree, FormTwo } from './OrderForm';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function LinearAlternativeLabel() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const {
    watch,
    trigger,
    formState: { errors }
  } = useFormContext();
  const [compiledForm, setCompiledForm] = useState({});
  const form = watch();
  const { t } = useTranslation();
  const steps = [t('order.start'), t('order.end'), t('order.orderInfo')];
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    // if (Boolean(errors.fromStation)) {
    //   //trigger(['longitude', 'latitude']);
    //   return;
    // }
    switch (activeStep) {
      case 0: {
        const check = await trigger([
          'fromStation.longitude',
          'fromStation.latitude',
          'fromStation.address',
          'fromStation.district',
          'fromStation.ward',
          'fromStation.city'
        ]);
        if (!check) return;
        break;
      }
      case 1: {
        const check = await trigger([
          'toStation.longitude',
          'toStation.latitude',
          'toStation.address',
          'toStation.district',
          'toStation.ward',
          'toStation.city'
        ]);
        if (!check) return;
        break;
      }

      case 2:
        setCompiledForm({ ...compiledForm, three: form });

        break;
      default:
        return 'not a valid step';
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    switch (activeStep) {
      case 0:
        setCompiledForm({ ...compiledForm, one: form });
        break;
      case 1:
        setCompiledForm({ ...compiledForm, two: form });
        break;
      case 2:
        setCompiledForm({ ...compiledForm, three: form });

        break;
      default:
        return 'not a valid step';
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    switch (activeStep) {
      case 1:
        setCompiledForm({ ...compiledForm, two: form });
        break;
      case 2:
        setCompiledForm({ ...compiledForm, three: form });
        break;
      default:
        return 'not a valid step';
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompiledForm({});
  };
  function getStepContent(step, formContent) {
    switch (step) {
      case 0:
        return <FormOne {...{ formContent }} />;
      case 1:
        return <FormTwo {...{ formContent }} />;
      case 2:
        return <FormThree {...{ formContent }} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120 }}>
            <Box>{getStepContent(activeStep, compiledForm)}</Box>
          </Paper>
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
