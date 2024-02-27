import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function MeetingPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dataReuniaoIni] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataReuniao = formData.get('dataReuniao');
    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const horarioInicio = formData.get('horarioInicio');
    const horarioTermino = formData.get('horarioTermino');
    
    const namesString = selectedUsers.map(user => user.name).join(', ');


    const errors = {}
    if (!dataReuniao) errors.dataReuniao = 'A data da reunião é obrigatória.';
    if (!horarioInicio) errors.horarioInicio = 'O horário de início é obrigatório.';
    if (!horarioTermino) errors.horarioTermino = 'O horário de término é obrigatório.';
    if (!titulo) errors.titulo = 'O título é obrigatório.';
    if (!descricao) errors.descricao = 'A descrição é obrigatória.';
    if (!namesString) errors.namesString = 'Selecione pelo menos um usuário.';


    setLoading(true);
    
      if(Object.keys(errors).length === 0){
        try {
          const response = await fetch('http://localhost:8000/api/v1/meetings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataReuniao,
              titulo,
              descricao,
              horarioInicio,
              horarioTermino,
              namesString }),
          });
    
          if (!response.ok) {
            throw new Error('Falha ao cadastrar meetings.');
          }
    
          toast.success('Reunião registrada com sucesso!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          router.push('/dashboard');
        } catch (error) {
          console.error('Erro ao fazer login:', error);
        }finally {
          setLoading(false);
        }
      }else{
        toast.error('Reunião com erro, Preencha todos os dados!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoading(false);
      }
      
  };


  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }
    fetchUsers();
  }, []);

  const handleUserSelection = (event, newValue) => {
    setSelectedUsers(newValue);
  };

  const renderForm = (
    <>
    <ToastContainer />
      <Stack spacing={3}>
        <TextField name="dataReuniao" defaultValue={dataReuniaoIni} label="Data da Reunião" type="date" InputLabelProps={{ shrink: true }} />
        <TextField name="titulo" label="Título" />
        <TextField name="descricao" label="Descrição" multiline rows={4} />
        <TextField name="horarioInicio" label="Horário de Início" type="time" InputLabelProps={{ shrink: true }} />
        <TextField name="horarioTermino" label="Horário de Término" type="time" InputLabelProps={{ shrink: true }} />
      
        <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.name}
            onChange={handleUserSelection}
            renderInput={(params) => <TextField {...params} label="Selecione os usuários" />}
          />

      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
      
        <LoadingButton
          loading={loading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
        >
          Cadastrar
        </LoadingButton>
      </Stack>
    </>
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '1200px',
        m: 'auto',
        p: 2,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: '1200px',
          }}
        >
          <Typography variant="h4"  sx={{ marginBottom: '20px' }}>Cadastrar Meeting</Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
