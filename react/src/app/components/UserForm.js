'use client';
import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function UserForm({ status, setStatus }) {
  const router = useRouter();

  return (
    <form style={{ width: '100%', maxWidth: '600px' }}>
      <Row>
        <Col>
          <TextField fullWidth label="Name" defaultValue="Mariya" variant="outlined" />
        </Col>
        <Col>
          <TextField fullWidth label="Surname" defaultValue="Zajaceva" variant="outlined" />
        </Col>
        <Col xs="auto">
          <Image
            src="/images/user.jpg"
            alt="Profile"
            width={100} 
            height={100}
            style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 30 }}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <TextField fullWidth label="Email" defaultValue="papirosa@otsos.by" variant="outlined" />
        </Col>
        <Col>
          <TextField fullWidth label="Phone number" defaultValue="+34 1111111" variant="outlined" />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <TextField fullWidth label="ID" defaultValue="153264" variant="outlined" />
        </Col>
        <Col>
          <TextField fullWidth label="Address" defaultValue="Av. de Madrid" variant="outlined" />
        </Col>
        <Col>
          <TextField fullWidth label="City" defaultValue="Jaen" variant="outlined" />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <FormControl fullWidth>
            <InputLabel>Sub type</InputLabel>
            <Select defaultValue="VIP" label="Sub type">
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>
        </Col>
        <Col>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="user">user</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </Select>
          </FormControl>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="success"
          style={{ width: '150px', backgroundColor: '#33b5aa', border: 'none' }}
          onClick={() => router.push('/adminmain')}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
