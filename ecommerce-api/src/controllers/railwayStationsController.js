import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


    // Валидация данных станции
    const validateStationData = (data) => {
      const errors = [];
      
      if (!data.city || data.city.trim().length === 0) {
        errors.push('City is required');
      }
      
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Station name is required');
      }
      
      if (!data.meetingPoint || data.meetingPoint.trim().length === 0) {
        errors.push('Meeting point is required');
      }
      
      return errors;
    }

  
    // Получить все станции
    export const getAllStations = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const city = req.query.city;
            
            const skip = (page - 1) * limit;
            const where = city ? {
                city: {
                    contains: city,
                    mode: 'insensitive'
                }
            } : {};
    
            const [stations, total] = await Promise.all([
                prisma.railwayStation.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { city: 'asc' }
                }),
                prisma.railwayStation.count({ where })
            ]);
    
            // Добавляем полные URL для фото
            const stationsWithFullUrls = stations.map(station => ({
                ...station,
                photo: station.photo ? `http://localhost:3001/uploads/${station.photo}` : null
            }));
    
            res.json({
                data: stationsWithFullUrls,
                meta: {
                    total: stations.length
                }
            });
        } catch (error) {
            console.error('Error fetching stations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
  
    // Получить станцию по ID
    export const getStationById = async (req, res) => {
      try {
        const station = await prisma.railwayStation.findUnique({
          where: { id: parseInt(req.params.id) }
        });
  
        if (!station) {
          return res.status(404).json({ error: 'Station not found' });
        }
  
        res.json(station);
      } catch (error) {
        console.error('Error fetching station:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    // Получить станции по городу
    export const getStationsByCity = async (req, res) => {
      try {
        const stations = await prisma.railwayStation.findMany({
          where: {
            city: {
              contains: req.params.city,
              mode: 'insensitive'
            }
          },
          orderBy: { name: 'asc' }
        });
  
        res.json(stations);
      } catch (error) {
        console.error('Error fetching stations by city:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    export const createStation = async (req, res) => {
        try {
            console.log('Request body:', req.body); // Для отладки
    
            const stationData = {
                city: req.body.city,
                name: req.body.name,
                meetingPoint: req.body.meetingPoint,
                photo: req.file ? `stations/${req.file.filename}` : null
            };
    
            console.log('Station data:', stationData); // Для отладки
    
            // Используем validateStationData напрямую, без this
            const errors = validateStationData(stationData);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
    
            // Проверка на существование станции с таким же названием в городе
            const existing = await prisma.railwayStation.findFirst({
                where: {
                    city: stationData.city,
                    name: stationData.name
                }
            });
    
            if (existing) {
                return res.status(400).json({
                    error: 'Station with this name already exists in this city'
                });
            }
    
            const station = await prisma.railwayStation.create({
                data: stationData
            });
    
            res.status(201).json({
                ...station,
                photo: station.photo ? `http://localhost:3001/uploads/${station.photo}` : null
            });
        } catch (error) {
            console.error('Error creating station. Details:', error); // Улучшенное логирование
            res.status(500).json({ 
                error: 'Internal server error',
                details: error.message 
            });
        }
    };
  
    // Обновить станцию
    export const updateStation = async (req, res) => {
      try {
        const stationId = parseInt(req.params.id);
        const stationData = {
          city: req.body.city,
          name: req.body.name,
          meetingPoint: req.body.meetingPoint,
          ...(req.file && { photo: req.file.path })
        };
  
        // Валидация данных
        const errors = validateStationData(stationData);
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }
  
        // Проверка существования станции
        const existingStation = await prisma.railwayStation.findUnique({
          where: { id: stationId }
        });
  
        if (!existingStation) {
          return res.status(404).json({ error: 'Station not found' });
        }
  
        // Проверка уникальности имени в городе
        if (stationData.name !== existingStation.name || stationData.city !== existingStation.city) {
          const duplicate = await prisma.railwayStation.findFirst({
            where: {
              city: stationData.city,
              name: stationData.name,
              id: { not: stationId }
            }
          });
  
          if (duplicate) {
            return res.status(400).json({
              error: 'Station with this name already exists in this city'
            });
          }
        }
  
        const updatedStation = await prisma.railwayStation.update({
          where: { id: stationId },
          data: stationData
        });
  
        res.json(updatedStation);
      } catch (error) {
        console.error('Error updating station:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    // Удалить станцию
    export const deleteStation = async (req, res) => {
      try {
        await prisma.railwayStation.delete({
          where: { id: parseInt(req.params.id) }
        });
  
        res.json({ message: 'Station deleted successfully' });
      } catch (error) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Station not found' });
        }
        console.error('Error deleting station:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  
  