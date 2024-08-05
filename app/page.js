'use client'
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Box, Button, Modal, Stack, TextField, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase'; 
import { collection, getDoc, getDocs, query, setDoc, deleteDoc, doc } from 'firebase/firestore';

const fakeAuth = {
    users: [],
    currentUser: null,
    register(username, password) {
        if (this.users.find(user => user.username === username)) {
            throw new Error('User already exists');
        }
        this.users.push({ username, password });
    },
    login(username, password) {
        const user = this.users.find(user => user.username === username && user.password === password);
        if (!user) throw new Error('Invalid credentials');
        this.currentUser = user;
    },
    logout() {
        this.currentUser = null;
    }
};

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!fakeAuth.currentUser);
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        try {
            fakeAuth.login(username, password);
            setIsLoggedIn(true);
            setOpenLogin(false);
            setUsername('');
            setPassword('');
            setError(null);
            navigate('/inventory');
        } catch (e) {
            setError(e.message);
        }
    };

    const handleRegister = () => {
        try {
            fakeAuth.register(username, password);
            handleLogin();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleLogout = () => {
        fakeAuth.logout();
        setIsLoggedIn(false);
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={3}
            p={3}
            bgcolor="#e3f2fd"
        >
            <Typography variant="h1" gutterBottom color="#0d47a1" textAlign="center" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                Pantry Tracker
            </Typography>

            {isLoggedIn ? (
                <>
                    <Typography variant="h6" gutterBottom color="#1565c0">
                        Welcome, {fakeAuth.currentUser.username}!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/inventory')}
                        style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '12px' }}
                    >
                        Go to Inventory Page
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                        style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '12px' }}
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenLogin(true)}
                        style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '12px' }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpenRegister(true)}
                        style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '12px' }}
                    >
                        Register
                    </Button>
                </>
            )}

            <Modal
                open={openLogin}
                onClose={() => setOpenLogin(false)}
                aria-labelledby="login-modal-title"
            >
                <Box
                    width={350}
                    p={3}
                    bgcolor="white"
                    margin="auto"
                    borderRadius="12px"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: '150px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                >
                    <Typography variant="h6" id="login-modal-title" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>Login</Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </Modal>

            <Modal
                open={openRegister}
                onClose={() => setOpenRegister(false)}
                aria-labelledby="register-modal-title"
            >
                <Box
                    width={350}
                    p={3}
                    bgcolor="white"
                    margin="auto"
                    borderRadius="12px"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: '150px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                >
                    <Typography variant="h6" id="register-modal-title" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>Register</Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleRegister}>
                        Register
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </Modal>
				{/* Footer Section */}
            <Box
                width="100%"
                textAlign="center"
                p={2}
                position="absolute"
                bottom={0}
                bgcolor="#0d47a1"
                color="white"
            >
                <Typography variant="body2" style={{fontFamily: 'Roboto'}}>
                    © 2024 Sidra Akhtar <br />
						  Built with Javascript, Next.js, React.js, Firebase, Material UI
                </Typography>
            </Box>
        </Box>
    );
};

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editItemName, setEditItemName] = useState('');
    const [editItemQuantity, setEditItemQuantity] = useState(0);
    const [originalItemName, setOriginalItemName] = useState('');

    const itemNameRef = useRef(null);
    const editItemNameRef = useRef(null);

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            });
        });
        setInventory(inventoryList);
        setFilteredInventory(inventoryList);
    };

    const addItem = async (item, qty) => {
        if (item && qty > 0) {
            const docRef = doc(collection(firestore, 'inventory'), item);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                await setDoc(docRef, { quantity: quantity + qty });
            } else {
                await setDoc(docRef, { quantity: qty });
            }
            await updateInventory();
        }
    };

    const removeItem = async (item, qty) => {
        const docRef = doc(collection(firestore, 'inventory'), item);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            if (quantity <= qty) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, { quantity: quantity - qty });
            }
        }
        await updateInventory();
    };

    const editItem = async () => {
        if (editItemName !== originalItemName) {
            await setDoc(doc(collection(firestore, 'inventory'), editItemName), { quantity: editItemQuantity });
            await deleteDoc(doc(collection(firestore, 'inventory'), originalItemName));
        } else {
            await setDoc(doc(collection(firestore, 'inventory'), originalItemName), { quantity: editItemQuantity });
        }
        await updateInventory();
        setEditItemName('');
        setEditItemQuantity(0);
        setOriginalItemName('');
        setOpenEdit(false);
    };

    useEffect(() => {
        updateInventory();
    }, []);

    useEffect(() => {
        if (typeof searchItem === 'string') {
            setFilteredInventory(
                inventory.filter(item =>
                    item.name.toLowerCase().includes(searchItem.toLowerCase())
                )
            );
        }
    }, [searchItem, inventory]);

    const handleOpenEdit = (name, quantity) => {
        setEditItemName(name);
        setEditItemQuantity(quantity);
        setOriginalItemName(name);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setEditItemName('');
        setEditItemQuantity(0);
        setOriginalItemName('');
        setOpenEdit(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (itemName && quantity) {
                addItem(itemName, parseInt(quantity, 10));
                setItemName('');
                setQuantity('');
            }
        }
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            p={3}
            bgcolor="#e3f2fd"
        >
            <Typography
                variant="h2" gutterBottom color="#0d47a1" textAlign="center" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
            >
                Pantry Tracker
            </Typography>

            <TextField
                variant="outlined"
                placeholder="Search items..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                style={{ marginBottom: '16px', width: '400px' }}
                InputProps={{
                    style: {
                        backgroundColor: 'white'
                    }
                }}
            />

            <Box display="flex" gap={2} alignItems="center">
                <TextField
                    variant="outlined"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    style={{ width: '200px' }}
                    InputProps={{
                        style: {
                            backgroundColor: 'white'
                        }
                    }}
                />
                <TextField
                    variant="outlined"
                    placeholder="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ width: '105px' }}
                    InputProps={{
                        style: {
                            backgroundColor: 'white'
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        addItem(itemName, parseInt(quantity, 10));
                        setItemName('');
                        setQuantity('');
                    }}
                    style={{ fontFamily: 'Roboto' }}
                    startIcon={<AddIcon />}
                >
                    Add New Item
                </Button>
            </Box>

            <Box
                width="100%"
                maxWidth="1200px"
                justifyContent={"center"}
                overflow="auto"
                borderRadius="8px"
                boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                bgcolor="white"
            >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#ADD8E6' }}>
                            <th style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>Item Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>Quantity</th>
                            <th style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item) => (
                            <tr key={item.name}>
                                <td style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>{item.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>
                                    <IconButton
                                        onClick={() => removeItem(item.name, 1)}
                                        style={{ color: '#f44336' }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => addItem(item.name, 1)}
                                        style={{ color: '#4caf50' }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenEdit(item.name, item.quantity)}
                                        style={{ color: '#ffa500' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => removeItem(item.name, item.quantity)}
                                        style={{ color: '#f44336' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>

            <Modal open={openEdit} onClose={handleCloseEdit}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={3}
                    bgcolor="white"
                    borderRadius="8px"
                    boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                    width="400px"
                    height="300px"
                    position="fixed"
                    top="50%"
                    left="50%"
                    sx={{ transform: "translate(-50%, -50%)" }}
                >
                    <Typography variant="h6" gutterBottom>
                        Edit Item
                    </Typography>
                    <Stack spacing={2} width="100%">
                        <TextField
                            label="Item Name"
                            variant="outlined"
                            value={editItemName}
                            onChange={(e) => setEditItemName(e.target.value)}
                            inputRef={editItemNameRef}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={editItemQuantity}
                            onChange={(e) => setEditItemQuantity(parseInt(e.target.value))}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={editItem}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCloseEdit}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

const App = () => (
	<Router>
		 <Routes>
			  <Route path="/" element={<HomePage/>} />
			  <Route path="/inventory" element={<InventoryPage/>} />
		 </Routes>
	</Router>
);

export default App;

