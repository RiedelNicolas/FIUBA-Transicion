import './App.css';
import { Checkbox, FormGroup, FormControl, FormControlLabel, FormLabel, InputLabel, Select, MenuItem, Grid, Paper, Box, Button, Alert, AlertTitle, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMaterias86 } from './utils/useMaterias86';
import DeleteIcon from '@mui/icons-material/Delete';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import ShareIcon from '@mui/icons-material/Share';
import Materia86 from './components/Materia86';
import Materia23 from './components/Materia23';
import ShareDialog from './components/ShareDialog';


const WEB_URL = process.env.REACT_APP_WEB_URL;

function App() {
  const [materiasPlan86, setMateriasPlan86] = useState(require(`./planes/informatica/plan_86.json`));
  const [materiasPlan23, setMateriasPlan23] = useState(require(`./planes/informatica/plan_23.json`));
  const [creditos, setCreditos] = useState(0);
  const [creditosDirectos, setCreditosDirectos] = useState(0);
  const [creditosTransicion, setCreditosTransicion] = useState(0);
  const [materias86, setMaterias86, readOnly] = useMaterias86("materias86-calculadorBilbao", []);
  const [materias23, setMaterias23] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [carrera, setCarrera] = useState("informatica");

  const agregarMateria86 = (materia) => {
    if (materias86.includes(materia)) return;

    setMaterias86(materias86.concat(materia));
  };

  const agregarMaterias86 = (materias) => {
    const filtradas = materias.filter(materia => !materias86.map(m => m.nombre).includes(materia.nombre));
    if (filtradas.length === 0) return;

    setMaterias86(materias86.concat(filtradas));
  };

  const seleccionarTodasObligatorias86 = () => {
    agregarMaterias86(materiasPlan86.obligatorias);
  };

  const limpiarTodo = () => {
    setMaterias86([]);
    setCreditosDirectos(0);
    setCreditosTransicion(0);
    setCreditos(0);
    setMaterias23([]);
  };

  const eliminarMateria86 = (materia) => {
    setMaterias86(materias86.filter(m => m.nombre !== materia.nombre));
  };

  const compartir = () => {
    let bits = "";
    let hexa = "";

    materiasPlan86.obligatorias.forEach(materia => {
      bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
    });

    materiasPlan86.orientaciones.forEach(orientacion => {
      orientacion.materias.forEach(materia => {
        bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
      });
    });

    materiasPlan86.electivas.forEach(materia => {
      bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
    });

    for (let i = 0; i < bits.length; i += 4) {
      hexa += parseInt(bits.slice(i, i+4), 2).toString(16);
    }

    setShareCode(hexa);
    setShareDialogOpen(true);
  }

  useEffect(() => {
    let _materias23 = [];
    let _creditos = 0;
    let taller2Usada = false;

    const tieneMaterias = (materias) => {
      return materias.every(materia => materias86.map(m => m.nombre).includes(materia))
    };

    materiasPlan23.forEach(materia => {
      if (materia.equivalencias === undefined) return;

      for (let i = 0; i < materia.equivalencias.length; i++) {
        if (taller2Usada && materia.equivalencias[i].materias.includes("Taller de Programación II"))
          continue;

        if (tieneMaterias(materia.equivalencias[i].materias)) {
          _materias23.push(materia.nombre);
          _creditos += materia.equivalencias[i].creditos;

          if (materia.equivalencias[i].materias.includes("Taller de Programación II"))
            taller2Usada = true;

          break;
        }
      }
    });

    setCreditosDirectos(materias86.map(materia => materia.creditosExtra).reduce((a, b) => a + b, 0));

    setMaterias23(_materias23);
    setCreditosTransicion(_creditos);
  }, [materias86]);

  useEffect(() => {
    setCreditos(creditosDirectos + creditosTransicion);
  }, [creditosDirectos, creditosTransicion]);

  useEffect(() => {
    setMateriasPlan86(require(`./planes/${carrera}/plan_86.json`));
    setMateriasPlan23(require(`./planes/${carrera}/plan_23.json`));
  }, [carrera]);

  return (
    <Box sx={{flexGrow: 1}} padding={2}>
      <Grid container sx={{ margin: "0 0 2rem 0" }}>
        <Grid item xs={12} sm="auto">
          <Paper elevation={3} sx={{padding: "1em"}}>
            <h2>Calculadora transición plan 86 a 2023</h2>
            <FormGroup>
              {
                readOnly ? (
                  <Alert severity="info">
                    <AlertTitle>Modo de solo lectura</AlertTitle>
                     Esta pantalla es solo compartir tu estado actual.<br />
                     En caso de querer modificarlo, ingresa en la <Link href={WEB_URL}>pantalla principal</Link>.
                  </Alert>
                ) : (
                    <>
                      <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SnowboardingIcon />}
                      sx={{ marginBottom: "1em" }}
                      onClick={seleccionarTodasObligatorias86}
                    >
                      Aprobar obligatorias
                    </Button>
      
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ marginBottom: "1em" }}
                      onClick={limpiarTodo}
                    >
                      Limpiar todo
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ShareIcon />}
                      onClick={compartir}
                    >
                      Compartir
                    </Button>
                  </>
                )
              }
              <ShareDialog codigo={shareCode} open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={12} sm="auto" sx={{ marginLeft: "auto" }}>
          <FormControl sx={{ minWidth: "20em" }}>
            <InputLabel>Carrera</InputLabel>
            <Select
              value={carrera}
              label="Carrera"
              onChange={(e) => setCarrera(e.target.value)}
            >
              <MenuItem value="informatica">Ingeniería en Informática</MenuItem>
              <MenuItem value="industrial">Ingeniería Industrial</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{padding: "1em", marginBottom: "2em"}}>
            <h2>Obligatorias</h2>
            <FormGroup>
              {materiasPlan86.obligatorias.map((materia, idx) =>
                <Materia86
                  key={`${materia.nombre}-86`}
                  materia={materia}
                  checked={materias86.some(m => m.nombre === materia.nombre)}
                  onCheck={agregarMateria86}
                  onUncheck={eliminarMateria86}
                  disabled={readOnly}
                />
              )}
            </FormGroup>
          </Paper>
          <Paper elevation={3} sx={{padding: "1em", marginBottom: "2em"}}>
            <h2>Orientación</h2>
            {materiasPlan86.orientaciones.map((orientacion, idx) =>
              <FormGroup key={orientacion.nombre} sx={{marginBottom: "1em"}}>
                <FormLabel>{orientacion.nombre}</FormLabel>
                {orientacion.materias.map((materia, idx) =>
                  <Materia86
                    key={`${materia.nombre}-86`}
                    materia={materia}
                    checked={materias86.some(m => m.nombre === materia.nombre)}
                    onCheck={agregarMateria86}
                    onUncheck={eliminarMateria86}
                    disabled={readOnly}
                  />
                )}
              </FormGroup>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{padding: "1em"}}>
            <h2>Electivas</h2>
            <FormGroup>
              {materiasPlan86.electivas.map(materia =>
                <Materia86
                  key={`${materia.nombre}-86`}
                  materia={materia}
                  checked={materias86.some(m => m.nombre === materia.nombre)}
                  onCheck={agregarMateria86}
                  onUncheck={eliminarMateria86}
                  disabled={readOnly}
                />
              )}
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{padding: "1em"}}>
            <h2>Plan 2023</h2>
            <FormGroup>
              {materiasPlan23.map(materia =>
                <Materia23
                  key={`${materia.nombre}-23`}
                  materiasPlan86={materiasPlan86}
                  materia={materia}
                  checked={materias23.includes(materia.nombre)}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={e => e.preventDefault()}
                    indeterminate={creditos > 0 && creditos < 24}
                    checked={creditos >= 24}
                  />
                }
                label={`Electivas: ${(creditos <= 24) ? creditos : 24}/24`}
              />
            </FormGroup>
            {
              (creditos > 24) ?
              `Créditos sobrantes: ${creditos - 24}` :
              null
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
