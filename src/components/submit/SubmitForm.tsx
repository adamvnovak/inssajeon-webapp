import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
//react
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
// @mui
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { Container, Box, Chip, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';
//components
import SubmitDeleteDialog from './SubmitDeleteDialog';
import SubmitSuccessDialog from './SubmitSuccessDialog';
import { PersistFormikValues } from 'formik-persist-values';
//database
import { v4 as uuidv4 } from "uuid";
import { PostEntity } from "../../db/entities/posts/PostEntity"
import { Timestamp } from "firebase/firestore";
import { PostInteraction } from "../../db/apis/PostInteraction"
// ----------------------------------------------------------------------

interface Tag {
  word: string;
  trendscore: number;
}

let FORM_SESSION_STORAGE_ID: string = "submit-form"

const TAGS_OPTIONS = [
  '대학',
  '가족',
  '음식',
];

export type NewPostFormValues = {
  word: string;
  definition: string;
  quote: string;
  tags: string[];
};

// ----------------------------------------------------------------------

interface SubmitFormProps {
  handleClose: VoidFunction
}

export default function SubmitForm( {handleClose} : SubmitFormProps) {
  let navigate = useNavigate();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const NewPostSchema = Yup.object().shape({
    word: Yup
      .string()
      .required('필수'),
    definition: Yup
      .string()
      .required('필수'),
    quote: Yup
      .string()
      .required('필수'),
    tags: Yup
      .array()
      .min(3, "적어도 3개")
      .max(7, "최대 7개"),
  });

  let postID:string = uuidv4().slice(24);

  const formik = useFormik<NewPostFormValues>({ //<NewPostFormValues is necessary for typescript
    initialValues: {
      word: '',
      definition: '',
      quote: '',
      tags: [''],
    },
    validationSchema: NewPostSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => { //if onSubmit is async isSubmitting automotically gets set to false after the async completes
      try {
        const post:PostEntity = {
          postID: postID,
          userID: "0", //TODO update
          word: values.word,
          definition: values.definition,
          quote: values.quote,
          timestamp: Timestamp.fromDate(new Date()),
          tags: values.tags,
          trendscore: 0, //TOODO update
          userProfile: { //TODO update 
            username: "0",
            bio: "0",
            picPath: "0",
            inssajeom: 0,
          },
          upvotes: [],
          downvotes: [],
          shares: [],
          flags: [],
          upvoteCount: 0,
          downvoteCount: 0,
          shareCount: 0,
          flagCount: 0,
        }
        await PostInteraction.createPost(postID, post);    
        setIsSuccessDialogOpen(true);
        //setSubmitting(false); i dont think this is needed
      } catch (error) {
        console.error(error)
      }
    },
  });

  const allDone = () => {
    formik.resetForm();
    sessionStorage.removeItem(FORM_SESSION_STORAGE_ID)
    handleClose();
    navigate(`/${postID}`, { replace: true }); //navigate to that submitted post
    //TODO: "click to share with friends!" icon
  }

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleDeleteDraft = ( ) => {
    setIsDeleteDialogOpen(false)
    sessionStorage.removeItem(FORM_SESSION_STORAGE_ID)
    formik.resetForm()
    handleClose()
  }

  return (
    <>
      <SubmitDeleteDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirmDelete={handleDeleteDraft}
      />
      <SubmitSuccessDialog
        open={isSuccessDialogOpen}
        handleClose={allDone}
      />
      <FormikProvider value={formik}> {/* FormikProvider allows you to define the formik context above and then pass it as a prop*/}
        <Form autoComplete="off" noValidate> {/* onSubmit is implicit within formik's Form component // noValidate turns off auto browser validation*/} 
          <PersistFormikValues name={FORM_SESSION_STORAGE_ID} storage="sessionStorage" persistInvalid={true} />
          <Stack spacing={2}>
            <TextField 
              id="word" //required
              type="text" //required
              fullWidth 
              placeholder="갑분사"
              label="단어 또는 표현" 
              disabled={formik.isSubmitting}
              {...formik.getFieldProps('word')} //wrapper for onChange, onBlur, value, checked. you no longer need to use formik's name prop either
              error={ Boolean(formik.errors.word) && formik.touched.word }
              helperText={ formik.errors.word && formik.touched.word && String(formik.errors.word) }
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              id="definition"
              type="text"
              placeholder="정확한 정의가 아니어도 괜찮아요"
              label="정의"
              disabled={formik.isSubmitting}
              {...formik.getFieldProps('definition')}
              error={ Boolean(formik.errors.definition) && formik.touched.definition }
              helperText={ formik.errors.definition && formik.touched.definition && String(formik.errors.definition) }
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              id="quote"
              type="text"
              placeholder="여기는 도움이 되는 예문을 쓰세요"
              label="인용 또는 예문"
              disabled={formik.isSubmitting}
              {...formik.getFieldProps('quote')}
              error={ Boolean(formik.errors.quote) && formik.touched.quote }
              helperText={ formik.errors.quote && formik.touched.quote && String(formik.errors.quote) }
            />
            <Autocomplete
              multiple
              freeSolo
              disabled={formik.isSubmitting}
              disableClearable
              value={formik.values.tags}
              onChange={(event, newValue) => {
                formik.setFieldValue('tags', newValue);
              }}
              //style={{ width: 500 }} //TODO fix this
              options={TAGS_OPTIONS.map((option) => option).filter(tag => !formik.values.tags.includes(tag))}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    //size="small"
                    label={option}
                  />
                ))
              }
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  label="태그" 
                  id="tags"
                  //dont use formik.getFieldProps for autocomplete input field.
                  error={ formik.values.tags.length<3 && formik.touched.tags }
                  helperText={ formik.values.tags.length<3 && formik.touched.tags && String(formik.errors.tags) }
                />
              }
            />
            <Container sx={{ mt: 3,pr:0, flexDirection:'row',display:'flex',justifyContent:'space-between', alignItems:'center'}}>
              <Box sx={{width:.5}}>
                <Typography  variant="body2" sx={{  wordBreak: 'keep-all'}}> {/*wordBreak: keep-all prevents words from breaking when wrapping*/}
                  업로드하기 전에 인싸전의 <a href="/content">콘텐츠 가이드라인스</a> 한번 읽어보세요 
                </Typography>
              </Box>
              <Button
                sx={{mr:1.5,width:.25, p:0}}
                startIcon={<DeleteIcon/>}
                type="button"
                color="error"
                variant="outlined"
                size="large"
                onClick={handleOpenDeleteDialog}
                disabled={formik.isSubmitting}
              >
                삭제
              </Button>
              <LoadingButton
                startIcon={<EditIcon/>}
                sx={{width:.25, p:0}}
                type="submit"
                variant="contained"
                size="large"
                loading={formik.isSubmitting}
              >
                입력
              </LoadingButton>
            </Container>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}