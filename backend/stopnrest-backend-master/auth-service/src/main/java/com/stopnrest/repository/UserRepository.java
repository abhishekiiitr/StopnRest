package com.stopnrest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stopnrest.model.User;

public interface UserRepository extends JpaRepository<User, String> {
	boolean existsByEmail(String email);
	User findByEmail(String email);
}
