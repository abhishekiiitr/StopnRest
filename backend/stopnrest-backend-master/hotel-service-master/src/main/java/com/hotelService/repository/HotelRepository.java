package com.hotelService.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hotelService.model.Hotel;

@Repository
public interface HotelRepository extends MongoRepository<Hotel, String> {
	List<Hotel> findByLocation_City (String city);
	
	@Query("{ 'owner_id': ?0 }")
	List<Hotel> findByOwnerId(String owner_id);
}
