package com.hotelService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hotelService.exception.HotelNotFoundException;
import com.hotelService.model.BookingDates;
import com.hotelService.model.Hotel;
import com.hotelService.model.Room;
import com.hotelService.model.RoomType;
import com.hotelService.model.RoomType.RoomCategory;
import com.hotelService.repository.HotelRepository;
import com.hotelService.dto.HotelAvailability;
import com.hotelService.dto.RoomAvailability;
import org.springframework.transaction.annotation.Transactional;
@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    private static final Logger logger = LoggerFactory.getLogger(HotelService.class);

    public Hotel createHotel(Hotel hotel) {
        // Generate rooms based on the room types provided
        for (RoomType roomType : hotel.getRoomTypes()) {
            // Initialize the room list if it's null
            if (roomType.getRooms() == null) {
                roomType.setRooms(new ArrayList<>());
            }

            // Calculate the number of rooms to create
            int currentRoomCount = roomType.getRooms().size();
            int roomsToCreate = roomType.getTotalRooms() - currentRoomCount;

            // Create new rooms as necessary
            for (int i = 0; i < roomsToCreate; i++) {
                Room newRoom = new Room();
                newRoom.setRoomId(UUID.randomUUID().toString());
                newRoom.setBooked(false);
                roomType.getRooms().add(newRoom);
            }
        }
        return hotelRepository.save(hotel);
    }
    
    public List<Hotel> getHotelsByOwnerID(String owner_id) {
        return hotelRepository.findByOwnerId(owner_id);
    }
    
    public Optional<Hotel> getHotelsById(String id) {
    	return hotelRepository.findById(id);
    }
    
    public List<Hotel> getHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotelsByLocation(String city) {
        return hotelRepository.findByLocation_City(city);
    }

    public void deleteHotel(String hotelId) {
        hotelRepository.deleteById(hotelId);
    }

//  ----- Get Available rooms based on the search with parameter city checkIn checkOut
    public List<HotelAvailability> getAvailableHotels(String city, Date checkInDate, Date checkOutDate, RoomType.RoomCategory category) {
        List<Hotel> hotelsInCity = hotelRepository.findByLocation_City(city);
        return hotelsInCity.stream().map(hotel -> createHotelAvailability(hotel, checkInDate, checkOutDate, category))
                .collect(Collectors.toList());
    }


    private HotelAvailability createHotelAvailability(Hotel hotel, Date checkInDate, Date checkOutDate, RoomType.RoomCategory category) {
        HotelAvailability hotelAvailability = new HotelAvailability();
        hotelAvailability.setHotelId(hotel.getHotel_id());
        hotelAvailability.setHotelName(hotel.getName());
        hotelAvailability.setCity(hotel.getLocation().getCity());  // Set the city
        hotelAvailability.setDescription(hotel.getDescription());   // Set the description
        hotelAvailability.setImages(hotel.getImages());

        Map<RoomType.RoomCategory, RoomAvailability> roomAvailabilityMap = new EnumMap<>(RoomType.RoomCategory.class);

        for (RoomType roomType : hotel.getRoomTypes()) {
            // Check if the room category matches the requested one (if category is provided)
            if (category != null && roomType.getRoomCategory() != category) {
                continue;  // Skip categories that don't match
            }

            RoomAvailability roomAvailability = new RoomAvailability();
            roomAvailability.setAvailableCount(0);
            roomAvailability.setAvailableRoomIds(new ArrayList<>());

            for (Room room : roomType.getRooms()) {
                if (isRoomAvailable(room, checkInDate, checkOutDate)) {
                    roomAvailability.setAvailableCount(roomAvailability.getAvailableCount() + 1);
                    roomAvailability.getAvailableRoomIds().add(room.getRoomId());
                }
            }

            roomAvailability.setPricePerNight(roomType.getPricePerRoom());
            roomAvailabilityMap.put(roomType.getRoomCategory(), roomAvailability);
        }

        hotelAvailability.setRoomAvailability(roomAvailabilityMap);
        return hotelAvailability;
    }

//    private boolean isRoomAvailable(Room room, Date checkInDate, Date checkOutDate) {
//        return room.getBookingDatesList().stream()
//                .noneMatch(bookingDates -> 
//                    (checkInDate.before(bookingDates.getCheckOut()) && checkOutDate.after(bookingDates.getCheckIn())) ||
//                    checkInDate.equals(bookingDates.getCheckIn()) || checkOutDate.equals(bookingDates.getCheckOut())
//                );
//    }


//     Helper method to check if a room is available for a given period
    private boolean isRoomAvailable(Room room, Date checkInDate, Date checkOutDate) {
        // If the room has no bookings, it's available
        if (room.getBookingDatesList().isEmpty()) {
            return true;
        }

        // Check if the requested dates overlap with any existing bookings
        for (BookingDates bookingDates : room.getBookingDatesList()) {
            if (!(checkOutDate.before(bookingDates.getCheckIn()) || checkInDate.after(bookingDates.getCheckOut()))) {
                // Dates overlap, room is not available
            	System.out.println("Can not generate it because rooms are not free");
                return false;
            }
        }
        // No overlaps found, room is available
        return true;
    }

    public Hotel updateHotel(String hotelId, Hotel updatedHotel) {
        return hotelRepository.findById(hotelId)
            .map(existingHotel -> {
                if (updatedHotel.getName() != null) {
                    existingHotel.setName(updatedHotel.getName());
                }
                if (updatedHotel.getLocation() != null) {
                    existingHotel.setLocation(updatedHotel.getLocation());
                }
                if (updatedHotel.getDescription() != null) {
                    existingHotel.setDescription(updatedHotel.getDescription());
                }
                if (updatedHotel.getOwner_id() != null) {
                    existingHotel.setOwner_id(updatedHotel.getOwner_id());
                }

                // Update total rooms
                if (updatedHotel.getTotal_room() > 0 && updatedHotel.getTotal_room() != existingHotel.getTotal_room()) {
                    int currentTotalRooms = existingHotel.getTotal_room();
                    existingHotel.setTotal_room(updatedHotel.getTotal_room());
                    adjustRooms(existingHotel, currentTotalRooms, updatedHotel.getTotal_room());
                }

                if (updatedHotel.getRoomTypes() != null) {
                    for (RoomType updatedRoomType : updatedHotel.getRoomTypes()) {
                        RoomType existingRoomType = findRoomType(existingHotel, updatedRoomType.getRoomCategory());
                        if (existingRoomType != null) {
                            if (updatedRoomType.getTotalRooms() != existingRoomType.getTotalRooms()) {
                                int currentRoomCount = existingRoomType.getRooms().size();
                                existingRoomType.setTotalRooms(updatedRoomType.getTotalRooms());
                                adjustRoomInstances(existingRoomType, currentRoomCount, updatedRoomType.getTotalRooms());
                            }
                            if (updatedRoomType.getAmenities() != null) {
                                existingRoomType.setAmenities(updatedRoomType.getAmenities());
                            }
                        }
                    }
                }
                if (updatedHotel.getImages() != null) {
                    existingHotel.setImages(updatedHotel.getImages());
                }
                if (updatedHotel.getRatings() != null) {
                    existingHotel.setRatings(updatedHotel.getRatings());
                }
                return hotelRepository.save(existingHotel);
            })
            .orElseThrow(() -> new HotelNotFoundException("Hotel not found with ID: " + hotelId));
    }

    private void adjustRooms(Hotel hotel, int currentTotalRooms, int newTotalRooms) {
        int roomsToAdjust = newTotalRooms - currentTotalRooms;

        // Adjust the total room count for all room types
        for (RoomType roomType : hotel.getRoomTypes()) {
            int currentRoomCount = roomType.getRooms().size();

            // Calculate how many rooms to add or remove
            if (roomsToAdjust < 0) {
                // Need to remove rooms
                int roomsToRemove = Math.min(-roomsToAdjust, currentRoomCount);
                for (int i = 0; i < roomsToRemove; i++) {
                    if (!roomType.getRooms().isEmpty()) {
                        roomType.getRooms().remove(roomType.getRooms().size() - 1); // Remove the last room
                    }
                }
            } else if (roomsToAdjust > 0) {
                // Need to add rooms
                for (int i = 0; i < roomsToAdjust; i++) {
                    Room newRoom = new Room();
                    newRoom.setRoomId(UUID.randomUUID().toString());
                    newRoom.setBooked(false);
                    roomType.getRooms().add(newRoom); // Add a new room
                }
            }
        }
    }

    private void adjustRoomInstances(RoomType roomType, int currentRoomCount, int newTotalRooms) {
        int roomsToAdjust = newTotalRooms - currentRoomCount;

        if (roomsToAdjust < 0) {
            // If we need to remove rooms
            for (int i = 0; i < -roomsToAdjust; i++) {
                if (!roomType.getRooms().isEmpty()) {
                    roomType.getRooms().remove(roomType.getRooms().size() - 1); // Remove the last room
                }
            }
        } else if (roomsToAdjust > 0) {
            // If we need to add rooms
            for (int i = 0; i < roomsToAdjust; i++) {
                Room newRoom = new Room();
                newRoom.setRoomId(UUID.randomUUID().toString());
                newRoom.setBooked(false);
                roomType.getRooms().add(newRoom); // Add a new room
            }
        }
    }

    private RoomType findRoomType(Hotel hotel, RoomCategory roomCategory) {
        return hotel.getRoomTypes().stream()
            .filter(rt -> rt.getRoomCategory() == roomCategory)
            .findFirst()
            .orElse(null);
    }

    // --------------new service Fun to update checkin checkout

    @Transactional
    public boolean updateRoomAvailability(String hotelId, RoomCategory roomCategory, boolean increase, String roomId, Date checkInDate, Date checkOutDate, String bookingId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found"));

        System.out.println("Hotel in the starting: " + hotel.getHotel_id());
        
        for (RoomType roomType : hotel.getRoomTypes()) {
            System.out.println("Checking room type: " + roomType.getRoomCategory());
            
            if (roomType.getRoomCategory() == roomCategory) {
                System.out.println("Room category matches: " + roomCategory);
                
                if (increase) {
                    // If increasing availability (cancelling a booking)
                    roomType.setAvailableRooms(roomType.getAvailableRooms() + 1);
                    logger.info("Increased availability for {} in hotel {}", roomCategory, hotel.getName());

                    for (Room room : roomType.getRooms()) {
                        if (room.getRoomId().equals(roomId)) {
                            boolean removed = room.getBookingDatesList().removeIf(bookingDates -> bookingDates.getBookingId().equals(bookingId));
                            System.out.println("After checking booking dates status should be true : "+ removed);
                            if (removed) {
                                if (room.getBookingDatesList().isEmpty()) {
                                    room.setBooked(false);
                                    System.out.println("Room marked as not booked: " + room.getRoomId());
                                }
                                logger.info("Booking canceled for room {} in hotel {}", roomId, hotel.getName());
                            } else {
                                logger.warn("Booking ID {} not found for room {}", bookingId, roomId);
                            }
                            break; // Exit the room loop
                        }
                    }
                } else {
                    // Booking a room
                    System.out.println("Attempting to book a room.");
                    
                    if (roomType.getAvailableRooms() > 0) {
                        roomType.setAvailableRooms(roomType.getAvailableRooms() - 1);
                        System.out.println("Available rooms decreased: " + roomType.getAvailableRooms());

                        for (Room room : roomType.getRooms()) {
                            if (room.getRoomId().equals(roomId) && isRoomAvailable(room, checkInDate, checkOutDate)) {
                                room.setBooked(true);
                                System.out.println("Room is available for booking: " + room.getRoomId());

                                BookingDates bookingDates = new BookingDates();
                                System.out.println("It is bookingDates instrances "+ bookingDates);
                                bookingDates.setCheckIn(checkInDate);
                                bookingDates.setCheckOut(checkOutDate);
                                bookingDates.setBookingId(bookingId);
                                
                                room.addBookingDates(bookingDates); // Ensure this works as expected
                                System.out.println("THe instance is there or not lets check : "+room.getBookingDatesList());
                                System.out.println("Booking dates added for room ID: " + roomId);
                                
                                logger.info("Room booked successfully in hotel {}: Room ID {}", hotel.getName(), room.getRoomId());
                                break; // Exit the room loop
                            } else {
                                System.out.println("Room ID: " + roomId + " is not available for the selected dates.");
                            }
                        }
                    } else {
                        logger.warn("No available rooms for {} in hotel {}", roomCategory, hotel.getName());
                        return false; // No available rooms
                    }
                }

                // Save changes to the hotel state
                try {
                    hotelRepository.save(hotel);
                    System.out.println("Hotel object before successfully updating: " + hotel);
                } catch (Exception e) {
                    logger.error("Error saving hotel: {}", e.getMessage());
                    return false; // Return false if save fails
                }

                return true; // Successfully updated availability
            }
        }
        
        System.out.println("No matching room category found.");
        return false; // No matching room category found
    }

}
